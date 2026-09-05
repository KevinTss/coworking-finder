import type { SiteConfig } from "../lib/types";

interface FooterProps {
  config: SiteConfig;
}

export function Footer({ config }: FooterProps) {
  return (
    <footer className="hidden border-t border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-500 sm:px-6 md:block lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p>
          Built with <span aria-label="love">♥</span> by{" "}
          <a
            className="font-medium text-zinc-950 underline-offset-4 hover:underline"
            href={config.author.linkedin_url}
            rel="noreferrer"
            target="_blank"
          >
            {config.author.name}
          </a>
        </p>
        <p className="flex gap-3">
          <a className="underline-offset-4 hover:text-zinc-950 hover:underline" href={config.author.linkedin_url} rel="noreferrer" target="_blank">
            LinkedIn
          </a>
          <a className="underline-offset-4 hover:text-zinc-950 hover:underline" href={config.author.github_url} rel="noreferrer" target="_blank">
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
