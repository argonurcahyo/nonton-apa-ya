import React from 'react'

const Rating = ({ rating }) => {
    const ratingCat = () => {
        let intRating = parseInt(rating)
        if (intRating < 5) {
            return "rotten"
        }
        if (intRating >= 5 && intRating < 7) {
            return "good"
        }
        if (intRating >= 7) {
            return "fresh"
        }
    }
    return (
        <div className={`rating-card ${ratingCat()}`}>
            {parseFloat(rating) * 10}
        </div>
    )
}

export default Rating