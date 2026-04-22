// ✅ Pagination Helper

const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10)); // Max 100 per page
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationResponse = (totalCount, page, limit, data) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    data,
    pagination: {
      totalCount,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage
    }
  };
};

module.exports = { getPaginationParams, getPaginationResponse };
