const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			auth: false,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			token: null,

		},
		actions: {
			// Use getActions to call a function within a fuction
			login: async (email, password) => {


				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"email": email,
					"password": password
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch("https://expert-fortnight-x59jvx4wr9j73v46v-3001.app.github.dev/api/login", requestOptions);
					const result = await response.json();

					if (response.status === 200) {
						sessionStorage.setItem("token", result.access_token)//guardamos
						return true
					}
					console.log(result);

				} catch (error) {
					console.error(error);
					return false;
				};
			},
			getProfile: async () => {
				let token = localStorage.getItem("token")
				try {
					const response = await fetch("https://expert-fortnight-x59jvx4wr9j73v46v-3000.app.github.dev/api/profile", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`
						},
					});
					const result = await response.json();
					console.log(result)
				} catch (error) {
					console.error(error);
				};
			},


			tokenVerify: async () => {
				const token = sessionStorage.getItem("token");// verifico el token al iniciar la sesion
				if (!token) {
					setStore({ auth: false });//si no recibo token devuelvo falso no access
					return false;
				}
				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/token-verify", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`//espero respuesta de que el token exise entonces si el estado de la respuesta
						},                                    // es verdarero, entonces devuelvo true y hago setStore para auth:true
					});
					if (response.status === 200) {
						setStore({ auth: true });
						return true;
					} else {
						setStore({ auth: false });
						localStorage.removeItem("token");
						return false;
					}
				} catch (error) {
					console.error("Error verificando el token:", error);
					setStore({ auth: false });
					sessionStorage.removeItem("token");//sessionstorage, para verficar en el inicio de sesio, local general, sesion vinculado, da mas seguridad
					return false;
				}
			},
			//crear un nuevo endpoint que se llame verificacion de token
			//la peticion en la funcion tokenVerify del front deberia actualizar un estado auth:
			// },
			logout: () => {
				sessionStorage.removeItem("token");//almacendo en la sesion el token, borrarlo al cerrar sesion
				setStore({ auth: false });//autenticacion falsa, setStore modifica a falso porque el token se borra
				window.location.href = "/login";//redireccino al inicio de sessions
			},


			//registro de usuarios, obligatorio la accion de email y contraseña, metodo POST
			signup: async (email, password) => {
				const requestOptions = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password })
				};

				try {
					const response = await fetch(process.env.BACKEND_URL + "/api/signup", requestOptions);
					const result = await response.json();

					if (response.status === 201) {
						return true;
					}
					console.log(result);
				} catch (error) {
					console.error("Error during signup:", error);
				}
				return false;
			},


			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
