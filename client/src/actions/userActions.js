const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export async function register(previousState,formData) {
    try {
        const email=formData.get("email")
        const password=formData.get("password")
        console.log({email,password});
        const res = await fetch(`${API_BASE_URL}/api/user/register`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({email,password})
        })
        const data = await res.json();
        if(data?.error){
            return {...previousState,error:data.error}
        }
        return {error:null,success: data};
    } catch (error) {
        return {...previousState, error:"Something went wrong"}
    }
}


export async function login(previousState,formData) {
    try {
        const email=formData.get("email")
        const password=formData.get("password")
        console.log({email,password});
        const res = await fetch(`${API_BASE_URL}/api/user/login`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: "include",
            body: JSON.stringify({email,password})
        })
        const data = await res.json();
        if(data?.error){
            return {...previousState,error:data.error}
        }
        return {error:null,success: data};
    } catch (error) {
        return {...previousState,error:"Something went wrong"}
    }
}