const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-muted/50 mt-auto">
            <div className="pb-4 pt-4">
                <p className="text-center text-sm text-muted-foreground">
                    © {currentYear} Receipt Analyzer. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer
