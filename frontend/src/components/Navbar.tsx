

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-border/50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 text-text-primary font-semibold text-lg tracking-tight">
                    <span>📚</span>
                    <span>BookRec AI</span>
                </div>

                <div className="flex items-center gap-6 text-sm font-medium text-text-secondary">
                    <a href="/" className="hover:text-text-primary transition-colors">Home</a>
                    <a href="/api-docs" className="hover:text-text-primary transition-colors">API Docs</a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors flex items-center gap-1">
                        GitHub
                    </a>
                </div>
            </div>
        </nav>
    );
}
