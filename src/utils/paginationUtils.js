const optionalPagination = (query, limit, offset) => {

    if (!isNaN(offset)) {
        query = query.skip(offset);
    }

    if (!isNaN(limit)) {
        query = query.limit(limit);
    }

    return query;
}

module.exports = {
    optionalPagination
}