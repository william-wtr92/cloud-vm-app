# VM Azure App

## Description

Le but de cette application est de permettre aux développeurs d'avoir une interface sous la forme d'une application web afin de pouvoir y créer des Machines Virtuelles jetables et d'y faire les tests souhaités.

## Stack 

Le site a été développé en **NextJS** pour le front-end et le back-end, pour le **SGBD**, j'ai utilisé **PostgreSQL**.

Pour entrer un peu plus dans les détails de la stack :

* Tout a été fait en **TypeScript** afin de pouvoir avoir une meilleure lisibilité du code et une meilleure maintenance.
* Pour l'ORM, j'ai utilisé **Objection** et pour le Query Builder **Knex**.
* Pour la validation au runtime des données, j'ai utilisé **Zod**.
* En termes de fetcher, j'ai utilisé **Axios** et **SWR** pour la gestion du cache en tant que Query Handler.
* Pour la gestion des cookies de session utilisateur et Azure, j'ai utilisé **nookies**.
* Les tokens JWT sont gérés avec **jsonwebtoken**.

## Sécurité

- Pour la sécurité, j'ai utilisé les **JWT** pour la gestion des tokens et **bcrypt** pour le hashage des mots de passe en base de données.
- Toutes les intéractions avec l'**API d'Azure** se font avec des tokens générés par Azure d'une durée **de 1h** et renouvelés au Login utilisateur.
- Les **cookies sont détruits à la déconnexion** de l'utilisateur et au bout de 1h il est déconnecté automatiquement.
- Les mots de passe générés pour l'accès au VMs **sont aléatoires** et respectent un certain format pour plus de sécurité.
- Toutes les données sensibles sont variabilisées dans le fichier **.env**.
- Les retours du backend sont **sanitizés pour filtrer les données sensibles**.

## Installation

- Une fois le projet installé et que vous êtes à sa racine, faites les consignes suivantes : 
  - Ensuite, il faut créer un fichier **.env** à la racine du projet et y mettre les variables ci-dessous :
    ```dotenv
    ## Config Azure 
    AZURE_TENANT_URL=""
    AZURE_CLIENT_ID=""
    AZURE_CLIENT_SECRET=""
    AZURE_SUBSCRIPTION_ID=""
        
    ## Nom du groupe de ressources
    AZURE_PROCESSING_GROUP_NAME=""
    ## Nom du Dev Test Lab
    AZURE_LABS_GROUP_NAME=""
        
    ## Nom d'utilisateur pour accéder aux VMs
    AZURE_VM_USERNAME="" 
    ## Sous-réseau associer au groupe de ressources
    AZURE_VIRTUAL_NETWORK_NAME=""
         
    ## Config DB Local (localhost)
         
    DB_CONNECTION_HOST=localhost
    DB_CONNECTION_USER=lenomdelutilisateur
    DB_CONNECTION_PWD=
    DB_CONNECTION_DB=lenomdelaBDD
        
    ## Config DB Docker (Pour Docker Compose uniquement)
    DB_CONNECTION_HOST_DOCKER=postgres
    DB_CONNECTION_PASSWORD_DOCKER=password
        
    ## SECURITY CONFIG (permet de sécuriser les mots de passe et les tokens)
        
    ## Vous pouvez mettre ce que vous voulez, mais il est conseillé de mettre des valeurs aléatoires 
    ## de plus de 15 caractères
        
    SECURITY_JWT_SECRET=
    SECURITY_PASSWORD_PEPPER=

  

  - Grâce à **Docker & Compose**, l'installation est très simple, il suffit lancer la commande suivante : <br>
    **! Attention de préremplir son .env avec les variables nécessaires !**
    ```bash
      docker-compose up -d
    ```
    
  - Pour lancer le projet **manuellement**, il suffit de lancer les commandes suivantes à la racine du projet : <br>
    **! Attention de préremplir son .env avec les variables nécessaires !**
    ```bash
      npm install       // installation des dépendances
      
      npm run dev      // lancement du projet 
    ```

## Manipulations Azure

### Inscription d'une application dans Azure AD

- Pour pouvoir utiliser l'API d'Azure, il faut d'abord inscrire une application dans Azure AD, voici les étapes à suivre :

  - Chercher **Inscriptions d'applications**
  - Cliquer sur **Nouvelle inscription**
  - Donner un nom à l'application 
  - Cliquer sur **S'inscrire**
  - Générer un secret client pour l'application dans **Informations d'identification**
  - Une fois l'application créée, il faut récupérer le **Tenant ID**, **Client ID** et le **Client Secret** pour les mettre dans le fichier **.env**.

### Ajout du role "Management" dans API Autorisée de l'Azure AD

- Sur votre application créée précédemment, rendez-vous dans **API Autorisée** :

  - Cliquer sur **Ajouter une autorisation**
  - Chercher **Azure Service Management** 
  - Cocher **user_impersonation**
  - Cliquer sur **Ajouter des autorisations**

### Création d'un groupe de ressources

- Pour pouvoir créer des VMs dans Azure, il faut d'abord créer un groupe de ressources, voici les étapes à suivre :

  - Chercher **Groupe de ressources** et cliquer sur **Créer**
  - Remplir les informations demandées et cliquer sur **Vérifier + créer**
  - Cliquer sur **Créer**
  - Une fois le groupe de ressources créé, il faut récupérer le **Nom du groupe de ressources** pour le mettre dans le fichier **.env**.

### Ajout de l'application dans le groupe de ressources

- Pour ajouter l'application créée précédemment dans le groupe de ressources, voici les étapes à suivre :

  - Chercher **Groupe de ressources** et cliquer sur le groupe de ressources créé précédemment
  - Cliquer sur **Accès (IAM)**
  - Cliquer sur **Ajouter**
  - Cliquer sur **Ajouter une attribution de rôle**
  - Cliquer sur **Rôles d'administrateur privilégié**
  - Cliquer sur **Propriétaire**
  - Sur l'onglet suivant "Membres" cliquer sur **Sélectionner un membre** et chercher l'application créée précédemment
  - En continuant sur l'onglet "Conditions" cliquer sur **Autoriser l'utilisateur à attribuer tous les rôles (à privilège élevé)**
  - Valider ensuite le tout en cliquant sur **Vérifier + attribuer**

### Création d'un Dev Test Lab

- Par la suite créé un Dev Test Lab pour pouvoir y créer des VMs, voici les étapes à suivre :

  - Chercher **Dev Test Labs** et cliquer sur **Créer**
  - Assigner votre **Dev Test Labs** au groupe de ressources créé précédemment
  - Remplir les informations demandées et cliquer sur **Vérifier + créer** (laisser les valeurs par défaut pour les autres champs
  - Cliquer sur **Créer**
  - Une fois le Dev Test Lab créé, il faut récupérer le **Nom du Dev Test Lab** pour le mettre dans le fichier **.env**.

### Création d'un Virtual Network

- Pour pouvoir créer des VMs dans Azure, il faut d'abord créer un Virtual Network, voici les étapes à suivre :

  - Chercher **Réseaux virtuels** et cliquer sur **Créer**
  - L'assigner au groupe de ressources créé précédemment 
  - Donner lui un nom
  - Laisser par défaut le reste et cliquer sur **Vérifier + créer**
  - Une fois le Virtual Network créé, il faut récupérer le **Nom du Virtual Network** pour le mettre dans le fichier **.env**.

### Création d'un NSG (Network Security Group) et application au Virtual Network

- Pour autoriser la connexion VNC, j'ai dû permettre le trafic entrant sur le port **5900** :

  - Chercher **Groupes de sécurité réseau**
  - Cliquer sur **Créer**
  - L'assigner au groupe de ressources créé précédemment
  - Donner lui un nom, par exemple : **{nomDuGroupeDeRessource}-nsg**
  - Cliquer sur **Vérifier + créer**
  - Regarder la vidéo suivante pour ajouter les règle que j'ai mise :
  - Une fois les règles ajoutées, se rendre dans le **Virtual Network** créé précédemment
  - Cliquer sur **Sous-réseaux**
  - Cliquer sur le sous-réseau créé précédemment
  - Sur **Groupes de sécurité réseau**, ajouté le **NSG** créé précédemment

### Récupération du SubscriptionID

- Pour récupérer le **SubscriptionID**, il suffit de cliquer sur **Abonnements** et de récupérer l'ID de l'abonnement.

## Informations

- À titre informatif **les VMs mettent environ 3-4 minutes à se créer** et à être prêtes à l'usage. Donc quand les credentials sont retournées sur l'interface, il faut attendre ce délai avant de pouvoir s'y connecter.
- Les VMs **sont supprimés 10 minutes après la création** et non pas 10 minutes après la première connexion.
- Les **VMs sous Windows mettent plus de temps à se créer que les VMs sous Linux**, reproduire le cas suivant si le setup est trop long :
    ```js
    > /src/utils/scheduleVmDeletion.ts
  
    export const scheduleVmDeletion = async ({
       ...
    }: VmInitialValues): Promise<void> => {
       setTimeout(async (): Promise<void> => {
          ...
       }, 600000) // Changer la valeur à la hausse pour changer le temps de suppression pour les VM Windows
    }

## Documentation Technique

### Architecture du code 

#### Root :
- `/src`: Contient tout le code de l'application

#### Configurations BDD :
- `/src/api`: Contient les configurations de la base de données, les Middlewares utilisés sur mes routes backends dans **/src/pages/api**, les Migrations, les Models et les Seeds.

#### Pages et API :
- `/src/pages`: Contient les View de l'application `Frontend`
- `/src/pages/api`: Contient les endpoints de l'application `Backend`

#### Services et Composants :
- `/src/web/services`: Contient les services de l'application qui permettent de faire des requêtes vers les endpoints dans **/src/pages/api**
- `/src/web/components`: Contient les composants réutilisables de l'application

#### Utilitaires :
- `/src/utils`: Contient les fonctions utilitaires de l'application comme la génération de mot de passe, des noms de VM aléatoires, etc...
- `/src/utils/types`: Contient les types de l'application
- 
#### Styles :
- `/src/styles`: Contient les styles CSS de l'application

### Explications des endpoints

- Dans le projet, j'ai utilisé l'**API REST d'Azure** pour pouvoir gérer les **VMs**, les **groupes de ressources** et le **Dev Test Labs**, je vais lister les différents endpoints utilisés: 
<br>
<br>

  - Login **OAuth2 Azure** et récupération des tokens JWT avec la permission d'interagir avec les VMs :
    - **POST**: `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token`
      - **Description** : Permet de se connecter à l'API d'Azure avec un utilisateur et un mot de passe.
        - **x-www-form-urlencoded**: 
          ```json
            {
                "grant_type": "client_credentials",
                "client_id": "client_id",
                "client_secret": "client_secret",
                "scope": "https://management.azure.com/.default"
            }
          ```
        - **Retour de l'API** (Token Valable 1h): 
          ```json
            {
            "token_type": "Bearer",
            "expires_in": 3599, 
            "ext_expires_in": 3599, 
            "access_token": "token..."
            }
          ```
        - Voici l'implémentation de cette requête dans mon code backend :
            ```js 
            > /api/login.ts 
          
            // Strucutre de l'objet x-www-form-urlencoded dans mon code 
            const config: AzureEncodeUrl = {
              grant_type: "client_credentials",
              client_id: process.env.AZURE_CLIENT_ID!,
              client_secret: process.env.AZURE_CLIENT_SECRET!,
              scope: "https://management.azure.com/.default",
            }
            
            // Préparation de l'URL et des options pour la requête
            const url: string = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_URL}/oauth2/v2.0/token`
          
            // Utilisation de la librairie qs pour encoder les données
            const data: string = qs.stringify(config)
          
            // Définition des headers pour la requête
            const options: RequestOption = {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
    
            let azureToken: string = ""
    
            // Query de l'API Azure pour récupérer le token
            const response = await axios.post(url, data, options)
            azureToken = response.data.access_token
            
            // Gestion des erreurs
            if (azureToken.length === 0) {
              throw new Error("Azure token not found")
            }
        
            // Envoi du token en réponse de la requête vers mon API backend /api/login
            res.send({ result: { jwt, azure_token: azureToken } })
  - Virtual Machines [**Create Or Update**](https://learn.microsoft.com/en-us/rest/api/dtl/virtual-machines/create-or-update?view=rest-dtl-2018-09-15&tabs=HTTP):
      - **PUT**: `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs/{labName}/virtualmachines/{name}?api-version=2018-09-15`
          - **Description** : Permet de créer une VM dans le Dev Test Lab.
              - **Headers**:
                ```json
                  {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer {token}"
                  }
                ```
              - **Body**:
                ```json
                  {
                    "properties": {
                      "size": "Standard_B1ls",
                      "userName": "usernameForVM",
                      "password": "PasswordForVM",
                      "labSubnetName": "{nameOfUrSubnet}Subnet",
                      "labVirtualNetworkId": "/subscriptions/{tenantId}/resourcegroups/{nameOfRessourceGroup}/providers/microsoft.devtestlab/labs/{nameOfLabs}/virtualnetworks/{nameOfUrVirtualNetwork}",
                      "galleryImageReference": {
                         "offer": "UbuntuServer",
                         "publisher": "Canonical",
                         "sku": "16.04-LTS",
                         "osType": "Linux",
                         "version": "Latest"
                      },
                      "allowClaim": true,
                      "storageType": "Standard"
                    },
                    "location": "francecentral",
                    "tags": {
                      "tagName1": "tagValue1"
                    }
                  }
                ```
              - **Retour de l'API** :
                ```json
                   {
                     "properties": {
                        "ownerObjectId": "",
                        "ownerUserPrincipalName": "",
                        "createdByUserId": "",
                        "createdByUser": "",
                        "createdDate": "2018-10-01T16:53:02.4830866-07:00",
                        "size": "Standard_B1ls",
                        "userName": "{userName}",
                        "labSubnetName": "{virtualNetworkName}Subnet",
                        "labVirtualNetworkId": "/subscriptions/{subscriptionId}/resourcegroups/resourceGroupName/providers/microsoft.devtestlab/labs/{labName}/virtualnetworks/{virtualNetworkName}",
                        "disallowPublicIpAddress": true,
                        "artifactDeploymentStatus": {
                           "artifactsApplied": 0,
                           "totalArtifacts": 0
                        },
                        "galleryImageReference": {
                           "offer": "UbuntuServer",
                           "publisher": "Canonical",
                           "sku": "16.04-LTS",
                           "osType": "Linux",
                           "version": "Latest"
                        },
                        "networkInterface": {},
                        "allowClaim": true,
                        "storageType": "Standard",
                        "virtualMachineCreationSource": "FromGalleryImage",
                        "dataDiskParameters": [],
                        "provisioningState": "Creating",
                        "uniqueIdentifier": "{uniqueIdentifier}"
                     },
                     "id": "/subscriptions/{subscriptionId}/resourcegroups/resourceGroupName/providers/microsoft.devtestlab/labs/{labName}/virtualmachines/{vmName}",
                     "name": "{vmName}",
                     "type": "Microsoft.DevTestLab/labs/virtualMachines",
                     "location": "{location}",
                     "tags": {
                       "tagName1": "tagValue1"
                     }
                }
                ```
              - Voici l'implémentation de cette requête dans mon code backend :
                ```js
                > /api/createVm.ts
                
                // Récupération de token passé en header de la requête
                const formatToken = req.headers.authorization?.slice(7)
                
                // Récupération du type d'OS pour la VM grace au osType passé en body de la requête
                const osConfig: ImageReferences = osImageReferences[osType]
    
                // Script de génération du mot de passe pour la VM
                const vmPassword: string = pwdVmGenerator()
    
                // Création de l'URL pour la requête
                const url: string = `https://management.azure.com/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourceGroups/${process.env.AZURE_PROCESSING_GROUP_NAME}/providers/Microsoft.DevTestLab/labs/${process.env.AZURE_LABS_GROUP_NAME}/virtualmachines/${generateRandomString(10)}?api-version=2018-09-15`
                
                // Création de l'objet à envoyer dans la requête
                const data: string = JSON.stringify({
                  properties: {
                    size: "Standard_B1ls",
                    userName: `${process.env.AZURE_VM_USERNAME}`,
                    password: vmPassword,
                    labSubnetName: `${process.env.AZURE_VIRTUAL_NETWORK_NAME}Subnet`,
                    labVirtualNetworkId: `/subscriptions/${process.env.AZURE_SUBSCRIPTION_ID}/resourcegroups/${process.env.AZURE_PROCESSING_GROUP_NAME}/providers/microsoft.devtestlab/labs/${process.env.AZURE_LABS_GROUP_NAME}/virtualnetworks/${process.env.AZURE_VIRTUAL_NETWORK_NAME}`,
                    galleryImageReference: osConfig,
                    allowClaim: true,
                    storageType: "Standard",
                  },
                  location: "francecentral",
                  tags: {
                   tagName1: "tagValue1",
                  },
                })
                
                // Création des headers pour la requête
                const options: RequestOption = {
                  headers: {
                    Authorization: `Bearer ${formatToken}`,
                    "Content-Type": "application/json",
                },

                try {
                  // Envoi de la requête
                  const response = await axios.put(url, data, options)
    
                  // Création de l'objet credentials pour la réponse
                  const credentials: Credentials = {
                     username: process.env.AZURE_VM_USERNAME!,
                     password: vmPassword,
                     ip: `${response.data.name}.${response.data.location}.cloudapp.azure.com`,
                  }
                  
                  // Création de l'objet vmData pour la planification des tâches en dessous
                  const vmData: VmInitialValues = {
                    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID!,
                    resourceGroupName: process.env.AZURE_PROCESSING_GROUP_NAME!,
                    labName: process.env.AZURE_LABS_GROUP_NAME!,
                    vmName: response.data.name,
                    jwt: formatToken,
                  }
                    
                  // Schedule des tâches de démarrage et de suppression de la VM
                  // Ces 2 processsus tournes en arrière plan et ne bloque pas la réponse de la requête
                 
                  scheduleVmStart(vmData) // Tentatives de démarrage de la VM
                  await scheduleVmDeletion(vmData) // Delete la VM au bout de 10minutes
    
                  return res.send({ result: { vm: response.data, credentials } })
                } catch (error) {
                  return res
                    .status(500)
                    .send({ error: "VM creation failed. Please try again." })
                }

  - Virtual Machines [**Delete**](https://learn.microsoft.com/en-us/rest/api/dtl/virtual-machines/delete?view=rest-dtl-2018-09-15&tabs=HTTP):
    - **Delete**: `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs/{labName}/virtualmachines/{name}?api-version=2018-09-15`
      - **Description** : Permet de delete une VM.
        - **Headers**:
          ```json
           {
              "Content-Type": "application/json",
              "Authorization": "Bearer {token}"
           }
            ```
        - On a vu plus haut sur mon endpoint : **/api/createVm**, jusqu'à la création de la VM, il y a une fonction **scheduleVmDeletion** appelée, elle permet la suppression automatique au bout de 10 minutes de la VM :
          ```js
            > /src/utils/scheduleVmDeleteion.ts          
          
            // Fonction de suppression de la VM qui prend en paramètre les données de la VM vue plus haut 
            export const scheduleVmDeletion = async ({
              subscriptionId,
              resourceGroupName,
              labName,
              vmName,
              jwt,
            }: VmInitialValues): Promise<void> => {
          
              // Utilisation de setTimeout pour attendre 10 minutes avant de lancer la suppression
              setTimeout(async (): Promise<void> => {
          
                // Création de l'URL pour la requête
                const url: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}?api-version=2018-09-15`
    
                 try {
                  // Envoi de la requête de suppression
                  await axios.delete(url, {
                    headers: { Authorization: `Bearer ${jwt}` },
                  })
                 } catch (error) {
                   throw new Error("Deletion failed. Please try again.")
                 }
              }, 600000) // 10 minutes
            }
          
  - Virtual Machines [**Start**](https://learn.microsoft.com/en-us/rest/api/dtl/virtual-machines/start?view=rest-dtl-2018-09-15&tabs=HTTP):
    - **Start**: `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs/{labName}/virtualmachines/{name}/start?api-version=2018-09-15`
        - **Description** : Permet de start une VM.
            - **Headers**:
              ```json
               {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer {token}"
               }
                ```
            - Dans l'endpoint: **/api/createVm**, j'appelle avant l'envoi de la réponse à l'utilisateur une fonction qui permet le start de la VM créée, car par défaut, elle ne se lance pas automatiquement.<br><br>
              Elle va donc regarder son statut grâce à l'API Azure : [**Get**](https://learn.microsoft.com/en-us/rest/api/dtl/virtual-machines/get?view=rest-dtl-2018-09-15&tabs=HTTP), qui va permettre d'attendre d'avoir le champ `provisioningState =  Succeeded` dans la réponse de la requête :
              ```js
               > /src/utils/scheduleVmStart.ts
              
               // Fonction de démarrage de la VM qui prend en paramètre les données de la VM vue plus haut
               export const scheduleVmStart = ({
                 subscriptionId,
                 resourceGroupName,
                 labName,
                 vmName,
                 jwt,
               }: VmInitialValues): void => {
                   // Nombre de tentatives de démarrage de la VM     
                   const maxRetries: number = 40
              
                   // Fonction récursive qui va tenter de démarrer la VM
                   const attemptStart = async (attempts: number = 0): Promise<void> => {
              
                     // Si le nombre de tentatives est atteint, on envoie une erreur 
                     if (attempts >= maxRetries) {
                       throw new Error("Failed to start the VM")
                     }

                     try {
                       // Création de l'URL pour la requête GET pour récupérer le statut de la VM provisioningState 
                       const checkIfExistUrl: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}?api-version=2018-09-15`
                       // Envoi de la requête
                       const statusResponse = await axios.get(checkIfExistUrl, {
                         headers: { Authorization: `Bearer ${jwt}` },
                       })
                       
                       // Si le statut de la VM de la VM est "Succeeded" on lance le start
                       if (statusResponse.data.properties.provisioningState === "Succeeded") {
              
                         // Création de l'URL pour la requête de démarrage
                         const startUrl: string = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${labName}/virtualmachines/${vmName}/start?api-version=2018-09-15`
                         await axios.post(
                            startUrl,
                            {},
                            { headers: { Authorization: `Bearer ${jwt}` } },
                         )         
                       } else {
                         // Si le statut n'est pas "Succeeded" on relance la fonction
                         setTimeout(() => attemptStart(attempts + 1), 30000)
                       }
                     } catch (error) {
                        // Si une erreur est retournée on relance la fonction
                        setTimeout(() => attemptStart(attempts + 1), 30000)
                     }
                   }
              
                   // Lancement de la fonction
                   attemptStart()
               }
              
### Docker & Docker Compose

- Pour le déploiement de l'application, j'ai utilisé **Docker** et **Docker Compose** pour pouvoir avoir une image de l'application et m'assurer qu'elle fonctionne dans n'importe quel environnement.
- La base de données est générée par le **Compose** et est liée à l'application.
- Les migrations de la base de données et l'ajout de data `seeds` sont faits automatiquement au lancement de la commande `docker-compose up -d` -> voir les fichiers `entrypoint.sh`, `Dockerfile`, `docker-compose.yml` pour plus de détails.

## Workflow de l'application

- Des images valent mieux que des mots, voici un schéma du workflow de l'application :
<br>[**Lien vers le Excalidraw qui montre mes schémas**](https://excalidraw.com/#json=S_LA0yQPig6-_t0JjrIyb,fnxEBVf2u5a_o6kmDeLWsQ)

![Capture d’écran 2024-02-18 à 16.38.04](https://i.imgur.com/75UyNSz.png)


- L'utilisateur a la possibilité de se **déconnecter**, ce qui supprime ses cookies de session et son token Azure.

## Mises à jour futures

- Connexion avec MSAL pour une meilleure gestion des tokens Azure.
- Ajout d'une liste de plusieurs OS pour les VMs.
- Ajout de la possibilité de choisir la taille des VMs.
- Stockage des VM en base de données pour une meilleure gestion.
- Ajout de la possibilité de choisir le temps de vie des VMs à la création.