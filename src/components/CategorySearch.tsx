"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";

interface CategorySearchProps {
    categories: Category[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function CategorySearch({ categories, value, onChange, placeholder = "Seleccionar categoría..." }: CategorySearchProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedCategory = categories.find((c) => c.id === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between border-slate-300"
                onClick={() => setOpen(!open)}
            >
                {selectedCategory ? selectedCategory.name : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            {open && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <div className="sticky top-0 z-10 bg-white px-2 py-1.5 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                className="w-full rounded-md border border-slate-200 bg-slate-50 py-1 pl-8 pr-2 text-sm focus:border-purple-500 focus:outline-none"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    {filteredCategories.length === 0 ? (
                        <div className="relative cursor-default select-none px-4 py-2 text-slate-500">
                            No se encontraron categorías.
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className={cn(
                                    "relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-slate-100 cursor-pointer",
                                    value === category.id ? "bg-slate-50 font-medium" : ""
                                )}
                                onClick={() => {
                                    onChange(category.id);
                                    setOpen(false);
                                    setSearchTerm("");
                                }}
                            >
                                <span className="block truncate">{category.name}</span>
                                {value === category.id && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-600">
                                        <Check className="h-4 w-4" />
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
