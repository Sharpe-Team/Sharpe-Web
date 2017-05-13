// URL of the API
var API_URL = "https://localhost:8443/";

// Function to hide the ErrorComponent by setting showError to false in the state
const hideError = function(component) {
	component.setState({
		error: {
			showError: false
		}
	});
}

// Function to handle the result of an API request by updating the state
const handleAPIResult = function(component, showError, message) {
	component.setState({
		error: {
			showError: showError,
			message: message
		},
		displayLoading: false
	});
}

// Function to display the LoadingComponent (call just before an API request)
const displayLoading = function(component) {
	component.setState({
		error: {
			showError: false,
			message: ""
		},
		displayLoading: true
	});
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const generateLoadingMessage = function(componentName){
    var messages = [
        ["Nous vérifions votre mot de passe ...","Nous nous assurons que vous êtes bien la bonne personne ...", "Nous consultons notre base de données ...", "Scanner rétinien en cours ..."],
        ["Nous ajoutons votre cercle ...", "Nous créons votre nouveau cercle ...", "Nous vérifions que vous avez choisi une belle image de profil ..."],
        ["Nous ajoutons ce nouvel utilisateur ...", "Nous vérifions l'ajout du nouvel utilisateur ...", "Nous consultons la NSA au sujet du nouvel utilisateur que vous ajoutez ...", "Nous vérifions que vous avez choisi une belle photo de profil pour votre compte ...", "Nous nous assurons que vous ne créez pas un compte \"Barack Obama\" ou autre juste pour vous amusez ..."]
    ];
    if(componentName == "LoginForm"){
        var choosenMessage = getRandomArbitrary(0, 3);
        return messages[0][choosenMessage];
    }
    if(componentName == "CircleForm"){
        var choosenMessage = getRandomArbitrary(0, 2);
        return messages[1][choosenMessage];
    }
    if(componentName == "UserForm"){
        var choosenMessage = getRandomArbitrary(0, );
        return messages[2][choosenMessage];
    }
    return "Ceci est un message parce qu'on a pas trouvé d'autres messages";
}

export {
	API_URL,
	hideError,
	handleAPIResult,
	displayLoading,
    generateLoadingMessage
};