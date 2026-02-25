import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import BookCard, { type Book } from '../components/BookCard';

export default function Home() {
    const [results, setResults] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (query: string) => {
        setIsLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            // Setup base axios call matching python backend
            // Replace with your actual backend URL when deploying
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

            const response = await axios.post(`${API_URL}/recommend`, { query, k: 10 }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000 // 10 second timeout for model inference
            });

            // Assuming API returns results directly, map appropriately based on backend model output format
            if (response.data?.results) {
                setResults(response.data.results);
            } else {
                setError("Unexpected response format from backend.");
            }
        } catch (err: any) {
            console.error("Backend fetch error:", err);
            setError(err.response?.data?.detail || "Failed to fetch recommendations. Please assure the backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const SkeletonCard = () => (
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-col h-full gap-4 animate-pulse">
            <div className="flex-1 space-y-3">
                <div className="h-6 bg-border/60 rounded-md w-3/4"></div>
                <div className="space-y-2 mt-4">
                    <div className="h-4 bg-border/40 rounded-md w-full"></div>
                    <div className="h-4 bg-border/40 rounded-md w-5/6"></div>
                    <div className="h-4 bg-border/40 rounded-md w-4/6"></div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex justify-between mb-2">
                    <div className="h-3 bg-border/40 rounded w-16"></div>
                    <div className="h-3 bg-border/60 rounded w-8"></div>
                </div>
                <div className="h-1.5 bg-border/40 rounded-full w-full"></div>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-6 font-interface text-text-primary">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* Header Section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-text-primary leading-[1.1]"
                    >
                        Discover your next <br className="max-md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                            great read.
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-text-secondary font-medium"
                    >
                        Semantic search powered by NLP, LSTM, and Hybrid Retrieval models.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="pt-8"
                    >
                        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    </motion.div>
                </div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-2 text-text-primary">Error Occurred</h3>
                            <p className="text-text-secondary max-w-md">{error}</p>
                        </motion.div>
                    ) : hasSearched || isLoading ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="flex items-center gap-3 mb-8 pl-2 border-l-4 border-accent">
                                <h2 className="text-2xl font-bold text-text-primary">
                                    {isLoading ? "Analyzing Semantic Spaces..." : "Top Recommendations"}
                                </h2>
                                {!isLoading && (
                                    <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-semibold text-text-secondary">
                                        {results.length} matches
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                                ) : results.length > 0 ? (
                                    results.map((book, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <BookCard book={book} index={i} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
                                        <BookOpen className="w-16 h-16 text-border mb-6" />
                                        <h3 className="text-xl font-medium text-text-primary mb-2">No matching books found</h3>
                                        <p className="text-text-tertiary">Try adjusting your terminology or try a broader topic.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

            </div>
        </main>
    );
}
