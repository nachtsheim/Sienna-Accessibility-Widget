
export function createTrustedTypePolicy() {
    if (typeof window !== 'undefined' && (window as any).trustedTypes && (window as any).trustedTypes.createPolicy) {
        return (window as any).trustedTypes.createPolicy('sienna-accessibility', {
            createHTML: (string: string) => string,
        });
    }
    return null;
}

const policy = createTrustedTypePolicy();

export function getTrustedHTML(html: string) {
    if (policy) {
        return policy.createHTML(html);
    }
    return html;
}
