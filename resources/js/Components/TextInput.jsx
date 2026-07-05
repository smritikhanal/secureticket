import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const localRef = useRef(null);
    useImperativeHandle(ref, () => ({ focus: () => localRef.current?.focus() }));
    useEffect(() => { if (isFocused) localRef.current?.focus(); }, [isFocused]);
    return (
        <input
            {...props}
            type={type}
            className={'glass-input rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground w-full ' + className}
            ref={localRef}
        />
    );
});
