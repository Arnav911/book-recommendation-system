import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

interface Suggestion {
    title: string;
    prediction?: string;
    source: 'match' | 'lstm';
}

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced autocomplete call
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            setIsAutocompleteLoading(true);
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const response = await axios.get(`${API_URL}/autocomplete?query=${encodeURIComponent(query)}`);

                const data = response.data;
                const newSuggestions: Suggestion[] = [];

                if (data.matches && data.matches.length > 0) {
                    data.matches.slice(0, 3).forEach((match: string) => {
                        newSuggestions.push({ title: match, source: 'match' });
                    });
                }

                if (data.prediction) {
                    // Only add prediction if it's not identical to a match
                    if (!newSuggestions.find(s => s.title === data.prediction)) {
                        newSuggestions.push({ title: query, prediction: data.prediction, source: 'lstm' });
                    }
                }

                setSuggestions(newSuggestions);
                setIsOpen(true);
            } catch (error) {
                console.error("Autocomplete error:", error);
            } finally {
                setIsAutocompleteLoading(false);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            setIsOpen(false);
            onSearch(query);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        const fullText = suggestion.prediction ?
            `${suggestion.title} ${suggestion.prediction}` : suggestion.title;
        setQuery(fullText);
        setIsOpen(false);
        onSearch(fullText);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
            <form
                onSubmit={handleSearch}
                className={cn(
                    "relative flex items-center bg-surface border-2 transition-all duration-300 shadow-sm hover:shadow-md",
                    isOpen && suggestions.length > 0 ? "rounded-t-2xl border-accent/20" : "rounded-full border-border hover:border-accent/40",
                    isLoading ? "opacity-90" : ""
                )}
            >
                <div className="pl-6 text-text-tertiary">
                    <Search className="w-5 h-5" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (suggestions.length > 0) setIsOpen(true);
                    }}
                    placeholder="Search for books, topics, authors, or descriptions..."
                    className="w-full bg-transparent px-4 py-4 md:py-5 text-lg outline-none text-text-primary placeholder:text-text-tertiary font-medium"
                />

                <div className="pr-4 flex items-center gap-2">
                    {isAutocompleteLoading && (
                        <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    )}
                    <button
                        type="submit"
                        disabled={isLoading || !query.trim()}
                        className="flex items-center justify-center p-2 md:px-5 md:py-2.5 bg-accent hover:bg-accent-hover active:bg-accent text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="hidden md:inline">Search</span>}
                        {!isLoading && <Search className="w-5 h-5 md:hidden" />}
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {isOpen && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-full z-40 bg-surface border-x-2 border-b-2 border-border border-t-0 rounded-b-2xl shadow-float overflow-hidden"
                    >
                        {suggestions.map((suggestion, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-6 py-4 hover:bg-background cursor-pointer flex items-center gap-3 transition-colors border-t border-border/40 first:border-t-0"
                            >
                                <div className="p-2 bg-background rounded-md text-text-tertiary">
                                    {suggestion.source === 'lstm' ? <BookOpen className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 text-base text-text-primary">
                                    <span className="font-medium">{suggestion.title}</span>
                                    {suggestion.prediction && (
                                        <span className="text-text-tertiary italic ml-1 font-normal opacity-80">
                                            {suggestion.prediction}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
