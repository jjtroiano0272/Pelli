import { appName } from "@/constants";

const es = {
  // Note: anything appended with '*' means I'm not sure of the translation
  common: {
    appName: "Peli",
    welcome: `¡Bienvenidos!`,
    alreadyHaveAccount: `¿Ya tienes una cuenta?`,
    dontHaveAccount: `¿No tienes una cuenta?`,
    loginText: `Inicia Sesión`,
    forgotPassword: `¿Has olvidado tu contraseña?`,
    public: "Público",

    endOfList: `¡No hay nada mas!`,
    fieldsMissing: "Todos los campos son obligatorios y no pueden estar vacíos", // *
    deleteTitle: "Borrar", // *
    cancel: "Cancelar",
    confirmDelete: `Si, borralo`,
    confirmLogout: "¿Estás seguro que quieres cerrar la sessión?",
    areYouSure: "¿Estás seguro?",
    nameInputPlaceholder: "Añadir nombre",
    emailInputPlaceholder: "Añadir correo eléctronico",
    passwordInputPlaceholder: "Añadir contraseña",
    phoneInputPlaceholder: "Añadir número de teléfono",
    addressInputPlaceholder: "Añadir dirección",
    bioInputPlaceholder: "Añadir bio",

    update: "Actualizar",
    post: "Posteo",
    clientName: "Nombre de cliente",
    allCaughtUp: "¡Te pusiste al día!",
    comment: "Commentario",
    commentVerb: "Commentar",
    confirm: "Confirmar",
    login: "Iniciar Sesión",
    logout: "Cerrar sesión",
    signUp: "Registrar",
    signOut: "Cerrar sesión",
    profile: "Perfil",
    notifications: "Notificaciones",
    postActionButton: "Publicar",
    submit: "Envíar",
    grantPermission: "Conceder permiso", // *
    done: "¡Listo!",
    deletedUser: "[eliminado]",
  },
  errors: {
    signOut: "Había un error de cerrar la sesión",
  },

  // Screen-specific
  welcomeScreen: {
    title: `¡Bienvenidos!`,
    missionStatement: `Queremos darte un lugar para compartir detalles sobre tus clientes, como a qué responde mejor su cabello y cualquier éxito o dificultad que hayas podido tener con ellos!`,
    gettingStarted: "Empezamos", // *
  },
  signUpScreen: {
    title: `Registrate`,
    alerts: {
      fieldsMissing: `Please fill all the fields in order to create your account`,
    },
    getStarted: "Empezamos", // *
    formPrompt: `Por favor añades todos los detalles a crear tu cuenta`,
  },
  loginScreen: {
    title: `Iniciar Sesión`,
    fieldsMissing: `¡Hay campos vacíos!`,
    welcomeBack1: `¡Ciao!`,
    welcomeBack2: `Bienvenido de vuelta`,
    pleaseLogin: `Por favor inicas la sesión a continuar`,
  },
  homeScreen: {
    clientName: "Cliente",
  },
  editProfileScreen: {
    title: "Editar Perfil",
    formPrompt: "Por favor añades los detalles de tu cuenta",
    deleteAccountButtonTitle: "Borrar mi cuenta",
    deletePromptTitle: "¿Borrar cuenta?",
    deletePromptDescription: `Una vez que elimines tu cuenta, tu perfil y nombre de usuario se eliminarán permanentemente de ${appName} y tus publicaciones y comentarios se desasociarán (aparecerán como 'usuario eliminado') de tu cuenta.*`,
    deleteAccountFinal: `Esta acción eliminará por completo su cuenta. Ingrese el texto a continuación para continuar (¡distingue entre mayúsculas y minúsculas!)`,
  },
  newPostScreen: {
    chooseSomeMedia: "Arrastrar y soltar o subir contenido multimedia", // *
    formulaTypePlaceholder: "Tipo (e.g. AVEDA, Tramesi, ...)",
    formulaDescriptionPlaceholder: "Descripción (e.g. 20g Bronze + 40 AU)",
    addToPost: "Añadir al posteo",
    title: "Crea un posteo",
    postBodyPlaceholder:
      "¿Cuáles son lost detalles del cliente que deseas compartir?", // *
  },
  postCard: { formulaCopied: "¡Has copiado la formula!" }, // *
  postDetailsSreen: {
    noPosts: "¡No hay un posteo acá!",
    commentInputPlaceholder: "Añadir un commentario...",
    noCommentsYet: "Seas el primer commentario",
    confirmDeletePost: "¿Borrar commentario?",
  },
  profileScreen: {
    myRecentPosts: "Mis posteos recientes:",
    contentSettings: "Configuración de contenido",
    showNsfw: "Mostrar posteos marcadas como inapropiadas", // *
    editBlockedUsers: "Editar cuentas bloqueadas",
  },
  forgotPasswordScreen: {
    title: "Reestablecer contraseña", // *
    sendReset: "Enviar", // *
    newPasswordPrompt: "¿Como es tu contraseña nueva?",
    passwordUpdateSuccess: "¡Contraseña reajustado!", // *
    passwordUpdateError: "Habia un error de reajustar tu contraseña", // *
    alerts: {
      emailMissing: "Dirección de correo no puede ser vacío!",
    },
  },
  editBlockedUsersScreen: {
    title: "Cuentas bloqueadas",
    noUsers: `No hay cuentas bloqueadas!`,
  },
  reportPostScreen: {
    thankYou: `Gracias por elegir enviar un informe. ¡Es importante que Pelli siga siendo un lugar agradable!`, // *
    title: "Envía un reporte",
  },
  searchableTextInputScreen: { addClient: "Añadir nueva cliente" },

  errorScreen: {},
  emptyStateComponent: {
    generic: {},
  },
};

export default es;
export type Translations = typeof es;
