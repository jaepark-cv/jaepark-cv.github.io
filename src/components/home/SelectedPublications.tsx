'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}


function getPublicationLink(pub: Publication): string | undefined {
    if (pub.url) return pub.url;
    if (pub.pdfUrl) return pub.pdfUrl;
    if (pub.doi) return `https://doi.org/${pub.doi}`;
    if (pub.arxivId) return `https://arxiv.org/abs/${pub.arxivId}`;
    return undefined;
}

function getVenueAcronym(venue?: string): string | undefined {
    if (!venue) return undefined;

    const parentheticalMatch = venue.match(/\(([A-Z][A-Z0-9\-/& ]{2,})\)/);
    if (parentheticalMatch?.[1]) {
        return parentheticalMatch[1].trim();
    }

    const knownVenues: Array<[RegExp, string]> = [
        [/International Conference on Learning Representations/i, 'ICLR'],
        [/Neural Information Processing Systems|Advances in Neural Information Processing Systems/i, 'NeurIPS'],
        [/Computer Vision and Pattern Recognition/i, 'CVPR'],
        [/International Conference on Computer Vision/i, 'ICCV'],
        [/Winter Conference on Applications of Computer Vision/i, 'WACV'],
        [/Empirical Methods in Natural Language Processing/i, 'EMNLP'],
        [/Association for the Advancement of Artificial Intelligence|AAAI/i, 'AAAI'],
        [/IEEE Transactions on Geoscience and Remote Sensing/i, 'IEEE TGRS'],
        [/IEEE Journal on Multiscale and Multiphysics Computational Techniques/i, 'IEEE JMMCT'],
        [/Deployable AI Workshop/i, 'DAI Workshop'],
    ];

    return knownVenues.find(([pattern]) => pattern.test(venue))?.[1];
}

function getVenueLabel(pub: Publication): string {
    const venue = pub.journal || pub.conference;
    const acronym = getVenueAcronym(venue);
    const venueLabel = acronym || venue;

    return [venueLabel, pub.year].filter(Boolean).join(' ');
}

function getPublicationHighlight(pub: Publication): string | undefined {
    if (/spotlight/i.test(pub.description || '')) {
        return pub.description;
    }

    return undefined;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => {
                    const publicationLink = getPublicationLink(pub);
                    const publicationHighlight = getPublicationHighlight(pub);

                    return (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            {publicationLink ? (
                                <a
                                    href={publicationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-accent transition-colors"
                                >
                                    <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                </a>
                            ) : (
                                <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                            )}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-400 mb-2">
                            {getVenueLabel(pub)}
                            {publicationHighlight && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                                    {publicationHighlight}
                                </span>
                            )}
                        </p>
                        {pub.description && !publicationHighlight && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                {pub.description}
                            </p>
                        )}
                    </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}
