// ==========================================
// SUPABASE CONNECTION
// ==========================================
const SUPABASE_URL = "https://sndqnkfxuybllmiyipvz.supabase.co ";

const SUPABASE_KEY = "sb_publishable_Sc4AdugcC-aXvnQ7dUKTnQ_obH8Ed5A";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// HOME PAGE SEARCH
// ==========================================

function searchRestaurant() {

    let search = document.getElementById("searchInput").value;

    if (search.trim() === "") {

        alert("Please enter a restaurant name.");

    } else {

        window.location.href =
            "restaurants.html?search=" +
            encodeURIComponent(search);

    }
}


// ==========================================
// RESTAURANT SEARCH
// ==========================================

function filterRestaurants() {

    let input =
        document.getElementById("restaurantSearch");

    if (!input) return;

    let filter =
        input.value.toLowerCase();

    let restaurants =
        document.querySelectorAll(".restaurant-card");

    restaurants.forEach(function(card) {

        let name =
            card.querySelector("h3").textContent.toLowerCase();

        if (name.includes(filter)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


// ==========================================
// SUBMIT REVIEW TO SUPABASE
// ==========================================

const reviewForm =
    document.getElementById("reviewForm");

if (reviewForm) {

    reviewForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("customerName").value.trim();

        const restaurant =
            document.getElementById("reviewRestaurant").value;

        const rating =
            Number(document.getElementById("customerRating").value);

        const review =
            document.getElementById("customerReview").value.trim();


        // Basic validation
        if (!name || !review) {

            alert("Please fill all required fields.");
            return;

        }


        // Insert review into Supabase
        const { data, error } = await supabaseClient
            .from("reviews")
            .insert([
                {
                    customer_name: name,
                    restaurant: restaurant,
                    rating: rating,
                    review: review
                }
            ]);


        // Check for error
        if (error) {

            console.error("Supabase Error:", error);

            alert(
                "Unable to submit review.\n\n" +
                error.message
            );

            return;
        }


        // Success
        alert(
            "Thank you " +
            name +
            "! Your review has been submitted successfully."
        );

        reviewForm.reset();

    });

}


// ==========================================
// LOAD REVIEWS
// ==========================================

async function loadReviews() {

    const reviewSection =
        document.getElementById("reviewsSection");

    if (!reviewSection) return;


    const { data, error } = await supabaseClient
        .from("reviews")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Error loading reviews:", error);

        reviewSection.innerHTML =
            "<p>Unable to load reviews.</p>";

        return;
    }


    reviewSection.innerHTML = "";


    if (data.length === 0) {

        reviewSection.innerHTML =
            "<p>No reviews yet. Be the first to write one!</p>";

        return;
    }


    data.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className = "review-card";


        const stars =
            "⭐".repeat(item.rating);


        card.innerHTML = `

            <div class="review-header">

                <div>
                    <h3>${escapeHTML(item.customer_name)}</h3>

                    <p>
                        ${escapeHTML(item.restaurant)}
                    </p>
                </div>

                <p class="rating">
                    ${stars}
                </p>

            </div>

            <p>
                "${escapeHTML(item.review)}"
            </p>

            <small>
                ${formatDate(item.created_at)}
            </small>

        `;


        reviewSection.appendChild(card);

    });

}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


// Load reviews when page opens
loadReviews();