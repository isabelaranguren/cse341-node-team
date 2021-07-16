const updateViewed = async (node) => {

    const movieId = node.parentNode.querySelector('[name=titleId]').value;
    const linkPath = window.location.origin;
    const csrf = node.parentNode.querySelector('[name=_csrf]').value;
    const isViewed = node.checked;

    try {
        const response = await fetch(`${linkPath}/edit-view`, {
            method: 'POST',
            headers: {
                'csrf-token': csrf
            },
            body: JSON.stringify({ movieId: movieId, isViewed: isViewed }), // Stringify our data so it can be read in JSON
        });

        // Same mechanism to check for errors.
        if (!response.ok) {
            throw new Error('Something went wrong!');
        };

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.log(error);
    }
}



const displayPending = () => {
    const nodeMovies = document.querySelectorAll('.cart__item');
    const moviesLi = Array.from(nodeMovies);
    const nodeInput = document.querySelectorAll('.isViewedBox');
    const inputView = Array.from(nodeInput);

    moviesLi.map((movie, index) => {
        if (inputView[index].checked) {
            movie.classList.add('hideMovie');
        } else {
            movie.classList.remove('hideMovie');
        }
    });
};

const displayAll = () => {
    const nodeMovies = document.querySelectorAll('.cart__item');
    const moviesLi = Array.from(nodeMovies);

    moviesLi.map((movie) => {
        movie.classList.remove('hideMovie');
    });
};

const displayViewed = () => {
    const nodeMovies = document.querySelectorAll('.cart__item');
    const moviesLi = Array.from(nodeMovies);
    const nodeInput = document.querySelectorAll('.isViewedBox');
    const inputView = Array.from(nodeInput);

    moviesLi.map((movie, index) => {
        if (!inputView[index].checked) {
            movie.classList.add('hideMovie');
        } else {
            movie.classList.remove('hideMovie');
        }
    });
};