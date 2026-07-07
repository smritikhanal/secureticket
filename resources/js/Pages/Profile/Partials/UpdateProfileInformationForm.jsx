import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({ name: user.name, email: user.email });
    const submit = (e) => { e.preventDefault(); patch(route('profile.update')); };

    return (
        <section className={className}>
            <header><h2 className="text-lg font-medium text-foreground">Profile Information</h2><p className="mt-1 text-sm text-muted-foreground">Update your account's profile information and email address.</p></header>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div><label className="block text-sm font-medium text-foreground mb-1.5">Name</label><input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" required /><InputError message={errors.name} className="mt-1" /></div>
                <div><label className="block text-sm font-medium text-foreground mb-1.5">Email</label><input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" required /><InputError message={errors.email} className="mt-1" /></div>
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div><p className="text-sm text-muted-foreground">Your email address is unverified. <Link href={route('verification.send')} method="post" as="button" className="text-primary underline hover:text-primary/80">Click here to re-send the verification email.</Link></p>{status === 'verification-link-sent' && <div className="mt-2 text-sm font-medium text-green-700">A new verification link has been sent to your email address.</div>}</div>
                )}
                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={processing}>Save</Button>
                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0"><p className="text-sm text-muted-foreground">Saved.</p></Transition>
                </div>
            </form>
        </section>
    );
}
