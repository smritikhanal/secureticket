#!/usr/bin/env python3
"""
Google Docs Report Generator for SecureTicket CW2
Uses the provided client secret to authenticate and create a Google Doc
with the full security report including screenshot placeholders.
"""

import os
import json
import pickle
from pathlib import Path
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Scopes required for Google Docs API
SCOPES = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive.file'
]

# Paths
CLIENT_SECRET_PATH = Path(r'C:\Users\Smriti\Desktop\secureticket\client_secret_16500940294-oeckmtusmr11cc8ta131ch8lpq76a31g.apps.googleusercontent.com.json')
TOKEN_PATH = Path(r'C:\Users\Smriti\Desktop\secureticket\token.pickle')
REPORT_PATH = Path(r'C:\Users\Smriti\Desktop\secureticket\openquill\full_report.md')

# Existing document ID to update (set to None to create new)
EXISTING_DOC_ID = '1k-28FzgtOFLuMd7W0WyeJgH89XahAhJiGIqVFm5fcNI'

def get_document_content(service, doc_id):
    """Get the full content of a document to determine its end index."""
    doc = service.documents().get(documentId=doc_id).execute()
    return doc.get('body', {}).get('content', [])

def get_end_index(content):
    """Get the end index of document content."""
    if not content:
        return 1
    last_element = content[-1]
    return last_element.get('endIndex', 1)

def clear_document(service, doc_id):
    """Clear all content from an existing document."""
    content = get_document_content(service, doc_id)
    end_index = get_end_index(content)
    
    if end_index > 1:
        # Subtract 1 to avoid deleting the final newline character
        service.documents().batchUpdate(
            documentId=doc_id,
            body={
                'requests': [{
                    'deleteContentRange': {
                        'range': {
                            'startIndex': 1,
                            'endIndex': end_index - 1
                        }
                    }
                }]
            }
        ).execute()
        print(f'Cleared document content (end index: {end_index})')

def get_credentials():
    """Get valid user credentials from storage or run OAuth flow."""
    creds = None
    
    # Load existing token
    if TOKEN_PATH.exists():
        with open(TOKEN_PATH, 'rb') as token:
            creds = pickle.load(token)
    
    # If no valid credentials, run OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRET_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save credentials for next run
        with open(TOKEN_PATH, 'wb') as token:
            pickle.dump(creds, token)
    
    return creds

def read_report():
    """Read the markdown report content."""
    with open(REPORT_PATH, 'r', encoding='utf-8') as f:
        return f.read()

def markdown_to_doc_requests(markdown_text):
    """Convert markdown to Google Docs API requests."""
    requests = []
    lines = markdown_text.split('\n')
    current_index = 1  # Start after initial empty paragraph
    
    for line in lines:
        if line.startswith('# '):
            # H1 - Title
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': line[2:] + '\n'
                }
            })
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': current_index,
                        'endIndex': current_index + len(line) - 1
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_1',
                        'spaceAbove': {'magnitude': 12, 'unit': 'PT'},
                        'spaceBelow': {'magnitude': 6, 'unit': 'PT'}
                    },
                    'fields': 'namedStyleType,spaceAbove,spaceBelow'
                }
            })
            current_index += len(line) - 1
            
        elif line.startswith('## '):
            # H2 - Section
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': line[3:] + '\n'
                }
            })
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': current_index,
                        'endIndex': current_index + len(line) - 2
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_2',
                        'spaceAbove': {'magnitude': 10, 'unit': 'PT'},
                        'spaceBelow': {'magnitude': 4, 'unit': 'PT'}
                    },
                    'fields': 'namedStyleType,spaceAbove,spaceBelow'
                }
            })
            current_index += len(line) - 2
            
        elif line.startswith('### '):
            # H3 - Subsection
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': line[4:] + '\n'
                }
            })
            requests.append({
                'updateParagraphStyle': {
                    'range': {
                        'startIndex': current_index,
                        'endIndex': current_index + len(line) - 3
                    },
                    'paragraphStyle': {
                        'namedStyleType': 'HEADING_3',
                        'spaceAbove': {'magnitude': 8, 'unit': 'PT'},
                        'spaceBelow': {'magnitude': 3, 'unit': 'PT'}
                    },
                    'fields': 'namedStyleType,spaceAbove,spaceBelow'
                }
            })
            current_index += len(line) - 3
            
        elif line.startswith('| ') and '|' in line[1:]:
            # Table row - skip for now, handle separately
            continue
            
        elif line.strip() == '---':
            # Horizontal rule
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': '\n'
                }
            })
            current_index += 1
            
        elif line.strip():
            # Regular paragraph
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': line + '\n'
                }
            })
            current_index += len(line) + 1
        else:
            # Empty line
            requests.append({
                'insertText': {
                    'location': {'index': current_index},
                    'text': '\n'
                }
            })
            current_index += 1
    
    return requests

def create_document(service, title):
    """Create a new Google Doc."""
    document = service.documents().create(body={'title': title}).execute()
    print(f'Created document: {document.get("documentId")}')
    return document.get('documentId')

def update_document(service, doc_id, requests):
    """Batch update document with requests."""
    if requests:
        service.documents().batchUpdate(
            documentId=doc_id,
            body={'requests': requests}
        ).execute()
        print(f'Applied {len(requests)} requests to document')

def add_screenshot_placeholders(service, doc_id):
    """Add screenshot placeholder sections with captions."""
    # This would add specific screenshot sections
    # For now, the markdown already contains [FIG X] references
    pass

def share_document(drive_service, doc_id, email=None):
    """Share document with specific email or make viewable by link."""
    # Make viewable by anyone with link
    permission = {
        'type': 'anyone',
        'role': 'reader'
    }
    drive_service.permissions().create(
        fileId=doc_id,
        body=permission,
        fields='id'
    ).execute()
    print('Document shared: anyone with link can view')
    
    # Get the link
    file = drive_service.files().get(fileId=doc_id, fields='webViewLink').execute()
    print(f'Document link: {file.get("webViewLink")}')
    return file.get('webViewLink')

def main():
    print("=" * 60)
    print("SecureTicket CW2 - Google Docs Report Generator")
    print("=" * 60)
    
    try:
        # Get credentials
        print("\n[1/5] Authenticating with Google...")
        creds = get_credentials()
        
        # Build services
        print("[2/5] Building API services...")
        docs_service = build('docs', 'v1', credentials=creds)
        drive_service = build('drive', 'v3', credentials=creds)
        
        # Read report
        print("[3/5] Reading report content...")
        report_content = read_report()
        print(f"    Report length: {len(report_content)} characters")
        
        # Use existing doc or create new
        if EXISTING_DOC_ID:
            print(f"[4/5] Updating existing document: {EXISTING_DOC_ID}...")
            doc_id = EXISTING_DOC_ID
            clear_document(docs_service, doc_id)
        else:
            print("[4/5] Creating Google Doc...")
            doc_id = create_document(docs_service, 'SecureTicket - Security Coursework 2 Report')
        
        # Convert markdown to doc requests
        print("[5/5] Populating document...")
        requests = markdown_to_doc_requests(report_content)
        update_document(docs_service, doc_id, requests)
        
        # Share document
        print("\nSharing document...")
        link = share_document(drive_service, doc_id)
        
        print("\n" + "=" * 60)
        print("SUCCESS! Report updated and shared.")
        print(f"Document ID: {doc_id}")
        print(f"View link: {link}")
        print("=" * 60)
        
        return doc_id, link
        
    except HttpError as error:
        print(f'\nAPI Error: {error}')
        return None, None
    except Exception as e:
        print(f'\nError: {e}')
        import traceback
        traceback.print_exc()
        return None, None

if __name__ == '__main__':
    main()