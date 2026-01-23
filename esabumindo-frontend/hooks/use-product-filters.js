import { useState, useCallback, useMemo } from "react";

export const useProductFilters = (allProducts = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Get unique types dan applications
  const availableTypes = useMemo(() => {
    const types = new Set(allProducts.map((p) => p.type));
    return Array.from(types).sort();
  }, [allProducts]);

  const availableApplications = useMemo(() => {
    const apps = new Set(allProducts.map((p) => p.application));
    return Array.from(apps).sort();
  }, [allProducts]);

  // Filter products berdasarkan search dan filters
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search filter - cek name, type, application, dan features
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchLower) ||
        product.type.toLowerCase().includes(searchLower) ||
        product.application.toLowerCase().includes(searchLower) ||
        product.features?.some((f) => f.toLowerCase().includes(searchLower));

      // Type filter
      const matchesType =
        selectedType === null || product.type === selectedType;

      // Application filter
      const matchesApplication =
        selectedApplication === null ||
        product.application === selectedApplication;

      return matchesSearch && matchesType && matchesApplication;
    });
  }, [allProducts, searchQuery, selectedType, selectedApplication]);

  // Hitung total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Handle search change
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset ke halaman 1
  }, []);

  // Handle type filter change
  const handleTypeChange = useCallback((type) => {
    setSelectedType(type);
    setCurrentPage(1);
  }, []);

  // Handle application filter change
  const handleApplicationChange = useCallback((app) => {
    setSelectedApplication(app);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  }, []);

  // Clear semua filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedType(null);
    setSelectedApplication(null);
    setCurrentPage(1);
    setItemsPerPage(12);
  }, []);

  // Check if ada active filters
  const hasActiveFilters =
    searchQuery !== "" || selectedType !== null || selectedApplication !== null;

  return {
    // State
    searchQuery,
    selectedType,
    selectedApplication,
    currentPage,
    itemsPerPage,

    // Data
    availableTypes,
    availableApplications,
    filteredProducts,
    paginatedProducts,
    totalPages,
    totalItems: filteredProducts.length,
    hasActiveFilters,

    // Handlers
    handleSearchChange,
    handleTypeChange,
    handleApplicationChange,
    handlePageChange,
    handleItemsPerPageChange,
    handleClearFilters,
  };
};
