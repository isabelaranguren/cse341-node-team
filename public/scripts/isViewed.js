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