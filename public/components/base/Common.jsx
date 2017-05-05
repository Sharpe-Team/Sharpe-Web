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

const generateLoadingMessage = function(componentName){
    var messages = [
        ["Nous vérifions votre mot de passe ...","Nous nous assurons que vous êtes bien la bonne personne ...", "Nous consultons notre base de données ...", "Scanner rétinien en cours ..."]
    ];
    if(componentName == "LoginForm"){
        var choosenMessage = Math.floor((Math.random() * 3));
        return messages[0][choosenMessage];
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