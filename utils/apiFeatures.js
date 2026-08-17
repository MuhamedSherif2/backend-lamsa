class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        if (this.queryString.keyword) {
            this.query = this.query.find({
                $or: [
                    {
                        name: {
                            $regex: this.queryString.keyword,
                            $options: "i"
                        }
                    },
                    {
                        description: {
                            $regex: this.queryString.keyword,
                            $options: "i"
                        }
                    }
                ]
            });
        }

        return this;
    }

    filter() {
        const queryObj = { ...this.queryString };

        const excludedFields = [
            "keyword",
            "sort",
            "page",
            "limit"
        ];

        excludedFields.forEach((field) => delete queryObj[field]);

        this.query = this.query.find(queryObj);

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            this.query = this.query.sort(
                this.queryString.sort.split(",").join(" ")
            );
        } else {
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    paginate() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 10;

        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = ApiFeatures;