class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search functionality
  search() {
    const keyword = this.queryString.keyword
      ? {
          $or: [
            { name: { $regex: this.queryString.keyword, $options: 'i' } },
            { description: { $regex: this.queryString.keyword, $options: 'i' } },
            { category: { $regex: this.queryString.keyword, $options: 'i' } },
            { brand: { $regex: this.queryString.keyword, $options: 'i' } }
          ]
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter functionality
  filter() {
    const queryCopy = { ...this.queryString };

    // Remove fields from query
    const removeFields = ['keyword', 'page', 'limit', 'sort', 'fields'];
    removeFields.forEach(el => delete queryCopy[el]);

    // Advanced filtering for price range, ratings, etc.
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sort functionality
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort by creation date (newest first)
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // Limit fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude __v field by default
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    this.query = this.query.skip(startIndex).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
