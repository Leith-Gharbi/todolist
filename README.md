# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



<#
.SYNOPSIS
    Script PowerShell pour ajouter ou retirer un utilisateur d'un groupe Azure AD et assigner ou supprimer un numéro de téléphone dans Microsoft Teams.

.DESCRIPTION
    Ce script utilise une application Azure AD et un certificat pour se connecter à Microsoft Teams et Azure AD sans interaction de l'utilisateur.
    Il peut soit ajouter un utilisateur à un groupe Azure AD et assigner un numéro de téléphone, soit retirer l'utilisateur du groupe et supprimer le numéro.
    Le type de traitement est contrôlé par le paramètre Action.

.PARAMETER UserPrincipalName
    Le nom principal de l'utilisateur (UPN) pour lequel l'action doit être effectuée (ex: user@domain.com).

.PARAMETER PhoneNumber
    Le numéro de téléphone à assigner ou supprimer, en format international (ex: +1234567890).

.PARAMETER LogFile
    Le chemin complet du fichier de log où les informations seront enregistrées (ex: C:\Logs\ManagePhoneNumber.log).

.PARAMETER Action
    Spécifie l'action à effectuer : "Assign" pour ajouter au groupe et assigner un numéro, "Remove" pour retirer du groupe et supprimer le numéro.

.EXAMPLE
    .\ManagePhoneNumber.ps1 -UserPrincipalName "user@domain.com" -PhoneNumber "+1234567890" -LogFile "C:\Logs\ManagePhoneNumber.log" -Action "Assign"

    .\ManagePhoneNumber.ps1 -UserPrincipalName "user@domain.com" -PhoneNumber "+1234567890" -LogFile "C:\Logs\ManagePhoneNumber.log" -Action "Remove"

.NOTES
    - Ce script nécessite les modules MicrosoftTeams et AzureAD.
    - Assurez-vous que l'application Azure AD dispose des autorisations nécessaires.
    - Le certificat doit être installé dans le magasin CurrentUser\My.
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$UserPrincipalName,

    [Parameter(Mandatory=$true)]
    [string]$PhoneNumber,

    [Parameter(Mandatory=$true)]
    [string]$LogFile,

    [Parameter(Mandatory=$true)]
    [ValidateSet("Assign", "Remove")]
    [string]$Action
)

# Paramètres d'application Azure AD
$TenantId = "votre-tenant-id"        # ID du locataire Azure AD
$ClientId = "votre-app-id"           # ID de l'application (AppId)
$CertificateThumbprint = "votre-certificat-thumbprint" # Empreinte numérique du certificat

# ID du groupe Azure AD
$GroupId = "votre-group-id" # Remplacez par l'ID réel du groupe office365licences_teams_Phone_mobile

# Fonction de journalisation
function Write-Log {
    param (
        [string]$Message
    )
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogMessage = "$Timestamp - $Message"
    Add-Content -Path $LogFile -Value $LogMessage
    Write-Output $LogMessage
}

# Début du processus
Write-Log "Début du processus pour l'utilisateur $UserPrincipalName avec l'action $Action et le numéro $PhoneNumber."

# Charger le certificat à partir du magasin de certificats local
try {
    Write-Log "Chargement du certificat avec l'empreinte numérique spécifiée."
    $Certificate = Get-Item "Cert:\CurrentUser\My\$CertificateThumbprint"
    if (-not $Certificate) {
        throw "Certificat introuvable avec l'empreinte numérique spécifiée."
    }
} catch {
    Write-Log "Erreur : $_"
    exit
}

# Connexion à Microsoft Teams et Azure AD en utilisant l'authentification par certificat
try {
    Write-Log "Tentative de connexion à Microsoft Teams et Azure AD avec le certificat."
    Connect-MicrosoftTeams -TenantId $TenantId -ClientId $ClientId -CertificateThumbprint $CertificateThumbprint
    Connect-AzureAD -TenantId $TenantId -ClientId $ClientId -CertificateThumbprint $CertificateThumbprint
    Write-Log "Connexion réussie à Microsoft Teams et Azure AD."
} catch {
    Write-Log "Erreur lors de la connexion : $_"
    exit
}

# Exécuter l'action basée sur le paramètre Action
if ($Action -eq "Assign") {
    try {
        # Ajouter l'utilisateur au groupe Azure AD
        Write-Log "Recherche de l'utilisateur $UserPrincipalName dans Azure AD."
        $User = Get-AzureADUser -ObjectId $UserPrincipalName
        Write-Log "Ajout de l'utilisateur $UserPrincipalName au groupe $GroupId."
        Add-AzureADGroupMember -ObjectId $GroupId -RefObjectId $User.ObjectId
        Write-Log "Succès : L'utilisateur $UserPrincipalName a été ajouté au groupe $GroupId."
    } catch {
        Write-Log "Erreur lors de l'ajout de l'utilisateur au groupe : $_"
        exit
    }

    try {
        # Vérifier que le numéro de téléphone est au format international
        if ($PhoneNumber -notmatch "^\+\d+$") {
            throw "Le numéro de téléphone doit être au format international (ex: +1234567890)."
        }
        
        # Assigner le numéro de téléphone à l'utilisateur
        Write-Log "Tentative d'assignation du numéro de téléphone $PhoneNumber à l'utilisateur $UserPrincipalName."
        Set-CsPhoneNumberAssignment -Identity $UserPrincipalName -PhoneNumber $PhoneNumber -PhoneNumberType CallingPlan
        Write-Log "Succès : Le numéro de téléphone $PhoneNumber a été assigné à l'utilisateur $UserPrincipalName."
    } catch {
        Write-Log "Erreur lors de l'assignation du numéro de téléphone : $_"
        exit
    }

} elseif ($Action -eq "Remove") {
    try {
        # Retirer l'utilisateur du groupe Azure AD
        Write-Log "Recherche de l'utilisateur $UserPrincipalName dans Azure AD pour le retrait du groupe."
        $User = Get-AzureADUser -ObjectId $UserPrincipalName
        Write-Log "Retrait de l'utilisateur $UserPrincipalName du groupe $GroupId."
        Remove-AzureADGroupMember -ObjectId $GroupId -MemberId $User.ObjectId
        Write-Log "Succès : L'utilisateur $UserPrincipalName a été retiré du groupe $GroupId."
    } catch {
        Write-Log "Erreur lors du retrait de l'utilisateur du groupe : $_"
        exit
    }

    try {
        # Supprimer le numéro de téléphone de l'utilisateur
        Write-Log "Tentative de suppression du numéro de téléphone pour l'utilisateur $UserPrincipalName."
        Remove-CsPhoneNumberAssignment -Identity $UserPrincipalName
        Write-Log "Succès : Le numéro de téléphone a été supprimé pour l'utilisateur $UserPrincipalName."
    } catch {
        Write-Log "Erreur lors de la suppression du numéro de téléphone : $_"
        exit
    }
}
