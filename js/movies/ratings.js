function getApprovedReviews(movieId) {
    let reviews = MetroStorage.get("reviews");
    let approved = [];

    for (let review of reviews) {
        if (review.movieId === movieId && review.status === "Approved") {
            approved.push(review);
        }
    }

    return approved;
}

function getAverageRating(movieId) {
    let reviews = getApprovedReviews(movieId);
    let total = 0;

    if (reviews.length === 0) {
        return "Not rated yet";
    }

    for (let review of reviews) {
        total = total + Number(review.rating);
    }

    return (total / reviews.length).toFixed(1) + " / 5";
}