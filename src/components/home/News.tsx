'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="text-sm text-neutral-700 dark:text-neutral-300">{children}</p>,
                                a: ({ children, href }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:text-accent-dark underline underline-offset-2"
                                    >
                                        {children}
                                    </a>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                            }}
                        >
                            {item.content}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
