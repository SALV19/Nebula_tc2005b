const vacationsLeftController = require('./contVacations.controller');

exports.get_home = async (request, response) => {
    try {
        const vacationsData = await vacationsLeftController.get_vacationsLeft(request, response)

        response.render('home_page', {
            // available_days: vacationsData.available_days,
            // total_days: vacationsData.total_days
        });
    } catch (error) {
        console.error(error);
    }
};
