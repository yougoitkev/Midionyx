import { useState, useEffect } from 'react';

const PAGE_SIZE = 8;

export function usePages() {
    const [pages, setPages] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from storage on mount
    useEffect(() => {
        try {
            const savedPages = localStorage.getItem('midionyx_pages');
            const savedCurrentPage = localStorage.getItem('midionyx_currentPage');
            const savedTotalPages = localStorage.getItem('midionyx_totalPages');

            let loadedPages = {};
            if (savedPages) {
                loadedPages = JSON.parse(savedPages);
                // Validate structure
                for (const pageNum in loadedPages) {
                    if (!loadedPages[pageNum].pads || loadedPages[pageNum].pads.length !== PAGE_SIZE) {
                        loadedPages[pageNum].pads = Array(PAGE_SIZE).fill(null);
                    }
                }
            }

            if (Object.keys(loadedPages).length === 0) {
                // Initialize default
                for (let i = 1; i <= 32; i++) {
                    loadedPages[i] = {
                        name: `Page ${i}`,
                        pads: Array(PAGE_SIZE).fill(null),
                        createdAt: Date.now()
                    };
                }
                setTotalPages(32);
            } else {
                setTotalPages(savedTotalPages ? parseInt(savedTotalPages) : Object.keys(loadedPages).length);
            }

            setPages(loadedPages);
            if (savedCurrentPage) setCurrentPage(parseInt(savedCurrentPage));

            setIsLoaded(true);
        } catch (e) {
            console.error('Error loading pages:', e);
            // Fallback init
            const initialPages = {};
            for (let i = 1; i <= 32; i++) {
                initialPages[i] = {
                    name: `Page ${i}`,
                    pads: Array(PAGE_SIZE).fill(null),
                    createdAt: Date.now()
                };
            }
            setPages(initialPages);
            setTotalPages(32);
            setIsLoaded(true);
        }
    }, []);

    // Save to storage whenever state changes
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('midionyx_pages', JSON.stringify(pages));
        localStorage.setItem('midionyx_currentPage', currentPage.toString());
        localStorage.setItem('midionyx_totalPages', totalPages.toString());
    }, [pages, currentPage, totalPages, isLoaded]);

    const goToPage = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    };

    const createNewPage = () => {
        const newPageNum = totalPages + 1;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setPages(prev => ({
            ...prev,
            [newPageNum]: {
                name: `Page ${newPageNum} (${timeStr})`,
                pads: Array(PAGE_SIZE).fill(null),
                createdAt: Date.now()
            }
        }));
        setTotalPages(newPageNum);
        setCurrentPage(newPageNum);
    };

    const renamePage = (pageNum, newName) => {
        if (pages[pageNum]) {
            setPages(prev => ({
                ...prev,
                [pageNum]: { ...prev[pageNum], name: newName }
            }));
        }
    };

    const deletePage = (pageNum) => {
        if (totalPages <= 1) return;

        const newPages = {};
        let newIndex = 1;

        // Rebuild pages object skipping the deleted one
        Object.keys(pages).sort((a, b) => Number(a) - Number(b)).forEach(key => {
            if (Number(key) !== pageNum) {
                newPages[newIndex] = pages[key];
                newIndex++;
            }
        });

        setPages(newPages);
        setTotalPages(newIndex - 1);

        if (currentPage >= pageNum && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const [history, setHistory] = useState([]);

    const pushToHistory = (action, data) => {
        setHistory(prev => [{ action, data, timestamp: Date.now() }, ...prev].slice(0, 20)); // Keep last 20 actions
    };

    const undo = () => {
        if (history.length === 0) return;

        const lastAction = history[0];
        const remainingHistory = history.slice(1);

        if (lastAction.action === 'clearPage') {
            const { pageNum, oldPads } = lastAction.data;
            setPages(prev => ({
                ...prev,
                [pageNum]: { ...prev[pageNum], pads: oldPads }
            }));
        } else if (lastAction.action === 'savePatchToPad') {
            const { pageNum, padIndex, oldPadData } = lastAction.data;
            const newPads = [...pages[pageNum].pads];
            newPads[padIndex] = oldPadData;
            setPages(prev => ({
                ...prev,
                [pageNum]: { ...prev[pageNum], pads: newPads }
            }));
        }

        setHistory(remainingHistory);
    };

    const clearPage = (pageNum) => {
        if (pages[pageNum]) {
            pushToHistory('clearPage', { pageNum, oldPads: [...pages[pageNum].pads] });
            setPages(prev => ({
                ...prev,
                [pageNum]: { ...prev[pageNum], pads: Array(PAGE_SIZE).fill(null) }
            }));
        }
    };

    const savePatchToPad = (pageNum, padIndex, patchData) => {
        if (pages[pageNum]) {
            pushToHistory('savePatchToPad', {
                pageNum,
                padIndex,
                oldPadData: pages[pageNum].pads[padIndex]
            });
            const newPads = [...pages[pageNum].pads];
            newPads[padIndex] = patchData;
            setPages(prev => ({
                ...prev,
                [pageNum]: { ...prev[pageNum], pads: newPads }
            }));
        }
    };

    const getPadData = (pageNum, padIndex) => {
        return pages[pageNum]?.pads[padIndex] || null;
    };

    return {
        pages,
        currentPage,
        totalPages,
        goToPage,
        nextPage,
        prevPage,
        createNewPage,
        renamePage,
        deletePage,
        clearPage,
        undo,
        canUndo: history.length > 0,
        savePatchToPad,
        getPadData,
        isLoaded
    };
}
