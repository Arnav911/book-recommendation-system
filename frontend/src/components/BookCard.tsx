
import { motion } from 'framer-motion';

export interface Book {
    title: string;
    authors: string;
    publication_year: number | null;
    language: string | null;
}

interface BookCardProps {
    book: Book;
    index: number;
}

export default function BookCard({ book, index }: BookCardProps) {
    // Generate a pseudo match score based on rank (0 is highest rank)
    const matchScore = Math.max(0.60, 0.98 - (index * 0.04));

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-surface border border-border p-6 rounded-2xl flex flex-col h-full shadow-sm hover:shadow-float gap-4 cursor-pointer"
        >
            <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary leading-tight mb-2">
                    {book.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed mb-1">
                    <span className="font-medium text-text-primary">Authors:</span> {book.authors || 'Unknown'}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-tertiary">
                    {book.publication_year && <span>Year: {book.publication_year}</span>}
                    {book.publication_year && book.language && <span>•</span>}
                    {book.language && <span className="uppercase">Lang: {book.language}</span>}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Match Rank</span>
                    <span className="text-xs font-semibold text-accent">#{index + 1}</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${matchScore * 100}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="bg-accent h-1.5 rounded-full"
                    />
                </div>
            </div>
        </motion.div>
    );
}
