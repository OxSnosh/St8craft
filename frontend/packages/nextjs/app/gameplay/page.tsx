"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { useRouter } from "next/navigation";

const MarkdownRenderer = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [copiedHeadingId, setCopiedHeadingId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/gameplay_guide.md")
      .then((res) => res.text())
      .then((text) => setMarkdownContent(text));

    // Scroll to the correct section on mount
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace("#", ""));
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleCopyLink = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest(".anchor-link") as HTMLAnchorElement;
      if (anchor && anchor.href) {
        e.preventDefault();
        navigator.clipboard.writeText(anchor.href).then(() => {
          console.log("Copied:", anchor.href);
        });
      }
    };
  
    document.addEventListener("click", handleCopyLink);
  
    return () => {
      document.removeEventListener("click", handleCopyLink);
    };
  }, []);
  
  useEffect(() => {
    const handleCopyLink = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest(".anchor-link") as HTMLAnchorElement;
      if (anchor && anchor.href) {
        e.preventDefault(); // Don't jump
        
        const hash = anchor.getAttribute('href') || "";
        const pathname = window.location.pathname;
        const fullUrl = `${window.location.origin}${pathname}${hash}`;

        navigator.clipboard.writeText(fullUrl).then(() => {
          console.log("Copied:", fullUrl);
          setCopiedHeadingId(hash); // Set copied ID
  
          // Reset after 500ms
          setTimeout(() => {
            setCopiedHeadingId(null);
          }, 500);
        });
      }
    };
  
    document.addEventListener("click", handleCopyLink);
    return () => {
      document.removeEventListener("click", handleCopyLink);
    };
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto prose prose-lg dark:prose-invert">
      <ReactMarkdown
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, {
            behavior: "wrap",
            properties: { className: ["anchor-link"] },
            content: {
              type: "element",
              tagName: "img",
              properties: {
                src: "/link.png",
                alt: "Link icon",
                width: 25,
                height: 25,
                className: "inline-block mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 self-center",
              },
              children: [],
            },
          }],
          rehypeHighlight,
        ]}
        components={{
          h1: ({ node, ...props }) => {
            const id = (node as any)?.properties?.id;
            const isCopied = id && `#${id}` === copiedHeadingId;
          
            return (
              <h1 className="flex items-center gap-2 text-4xl font-bold mt-8 mb-4 group relative" id={id}>
                {props.children}
                {isCopied && (
                  <span className="absolute -left-24 text-green-500 text-sm animate-bounce">Copied!</span>
                )}
              </h1>
            );
          },
          h2: ({ node, ...props }) => {
            const id = (node as any)?.properties?.id;
            const isCopied = id && `#${id}` === copiedHeadingId;
          
            return (
              <h2 className="flex items-center gap-2 text-3xl font-semibold mt-6 mb-3 group relative" id={id}>
                {props.children}
                {isCopied && (
                  <span className="absolute -left-24 text-green-500 text-sm animate-bounce">Copied!</span>
                )}
              </h2>
            );
          },
          h3: ({ node, ...props }) => {
            const id = (node as any)?.properties?.id;
            const isCopied = id && `#${id}` === copiedHeadingId;
          
            return (
              <h3 className="flex items-center gap-2 text-2xl font-semibold mt-5 mb-2 group relative" id={id}>
                {props.children}
                {isCopied && (
                  <span className="absolute -left-24 text-green-500 text-sm animate-bounce">Copied!</span>
                )}
              </h3>
            );
          },
          h4: ({ node, ...props }) => {
            const id = (node as any)?.properties?.id;
            const isCopied = id && `#${id}` === copiedHeadingId;
          
            return (
              <h4 className="flex items-center gap-2 text-xl font-semibold mt-4 mb-1 group relative" id={id}>
                {props.children}
                {isCopied && (
                  <span className="absolute -left-24 text-green-500 text-sm animate-bounce">Copied!</span>
                )}
              </h4>
            );
          },
          p: ({ node, ...props }) => (
            <p className="text-base leading-relaxed mb-4" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-500 hover:underline" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-gray-100 dark:bg-gray-800 rounded px-1" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;