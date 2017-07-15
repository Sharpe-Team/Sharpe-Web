/**
 * URL of the API
 */
const API_URL = "https://localhost:8443/";

/**
 * Function to hide the ErrorComponent by setting showError to false in the state
 * @param component the component which the state should be updated
 */
const hideError = function(component) {
	component.setState({
		error: {
			showError: false
		}
	});
};

const userType = {
    user : 0,
    admin : 1
}
    
/**
 * Function to handle the result of an API request by updating the state
 * @param component the target component where the state should be updated
 * @param showError if the component should displayed the error message
 * @param message the error message
 */
const handleAPIResult = function(component, showError, message) {
	component.setState({
		error: {
			showError: showError,
			message: message
		},
		displayLoading: false
	});
};

/**
 * Function to display the LoadingComponent (call just before an API request)
 * @param component the component where the Loading component should be displayed
 */
const displayLoading = function(component) {
	component.setState({
		error: {
			showError: false,
			message: ""
		},
		displayLoading: true
	});
};

/**
 * Function to get a random number between a range
 * @param min the minimum value
 * @param max the maximum value
 * @returns {number} the random number
 */
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Function to generate a loading message for the LoadingComponent
 * @param componentName the name of the component
 * @returns {string} the choosen message
 */
const generateLoadingMessage = function(componentName) {
    let messages = [
        ["Nous vérifions votre mot de passe ...", "Nous nous assurons que vous êtes bien la bonne personne ...", "Nous consultons notre base de données ...", "Scanner rétinien en cours ..."],
        ["Nous ajoutons votre cercle ...", "Nous créons votre nouveau cercle ...", "Nous vérifions que vous avez choisi une belle image de profil ..."],
        ["Nous ajoutons ce nouvel utilisateur ...", "Nous vérifions l'ajout du nouvel utilisateur ...", "Nous consultons la NSA au sujet du nouvel utilisateur que vous ajoutez ...", "Nous vérifions que vous avez choisi une belle photo de profil pour votre compte ...", "Nous nous assurons que vous ne créez pas un compte \"Barack Obama\" ou autre juste pour vous amusez ..."]
    ];
	let choosenMessage = "Ceci est un message parce qu'on a pas trouvé d'autres messages";
    if(componentName === "LoginForm") {
        let index = getRandomArbitrary(0, messages[0].length - 1);
        choosenMessage = messages[0][index];
    }
    if(componentName === "CircleForm") {
        let index = getRandomArbitrary(0, messages[1].length - 1);
		choosenMessage = messages[1][index];
    }
    if(componentName === "UserForm") {
        let index = getRandomArbitrary(0, messages[2].length - 1);
        choosenMessage = messages[2][index];
    }
    return choosenMessage;
};

/**
 * Get user information from localStorage of the browser
 * @returns {{id, firstname, lastname, email, profilePicture}}
 */
const getUserFromStorage = function() {
	let user = {
		id: localStorage.getItem('user-id'),
		firstname: localStorage.getItem('user-firstname'),
		lastname: localStorage.getItem('user-lastname'),
		email: localStorage.getItem('user-email'),
		profilePicture: localStorage.getItem('user-profile-picture'),
		admin: localStorage.getItem('user-admin'),
        ruc: localStorage.getItem('user-ruc')
	};

	user.id = parseInt(user.id);
    
    if(user.ruc)
        user.ruc = JSON.parse(user.ruc);

	return user;
};

export {
	API_URL,
	hideError,
	handleAPIResult,
	displayLoading,
    generateLoadingMessage,
    getUserFromStorage,
	userType
};