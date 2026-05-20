import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

const Form = ({ onSubmitHandler, loadingState, onSendAuthMode, username, email, password }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({criteriaMode: "all", defaultValues: {username: '', email: '', password: ''}});

    let isFilled;
    if(username && email && password) {
        const user = watch("username");
        const em = watch("email");
        const pass = watch("password");
        isFilled = user && em && pass;
    }
    else if (email && password) {
        const em = watch("email");
        const pass = watch("password");
        isFilled = em && pass;
    }

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)}
            className="flex flex-col gap-y-7 w-2xs"
        >
            
            <div className="w-full">
                {username && <input type="text" placeholder="Username"
                className="w-full bg-transparent focus:bg-transparent focus:outline-none border-b-2" 
                {...register("username", {
                    required: {
                        value: true,
                        message: "Username is required!"
                    },
                    validate: {
                        isUsernameExist: async () => {
                            // TODO: apply bloom filter algorithm and check username's availability
                            return true;
                        }
                    }
                })}/>}
                <span className="text-red-800 text-xs font-semibold">
                    <ErrorMessage
                        errors={errors}
                        name="username"
                        render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                            <p key={type}>{message}</p>
                        ))}
                    />
                </span>
            </div>

            <div className="w-full">
                {email && <input type="text" placeholder="Email address" 
                className="w-full bg-transparent focus:bg-transparent focus:outline-none border-b-2" 
                {...register("email", {
                    required: {
                        value: true,
                        message: "Email is required!"
                    },
                    pattern: {
                        value: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/g,
                        message: "Enter a valid email address!"
                    }
                })}/>}

                <span className="text-red-800 text-xs font-semibold">
                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                            <p key={type}>{message}</p>
                        ))}
                    />
                </span>
            </div>

            <div className="w-full">
                {password && <input type="password" placeholder="Password"
                className="w-full bg-transparent focus:bg-transparent focus:outline-none border-b-2" 
                {...register("password", {
                    required: {
                        value: true,
                        message: "Password is required!"
                    },
                    minLength: {
                        value: 7,
                        message: "Minimum 7 characters are required!"
                    },
                    maxLength: {
                        value: 25,
                        message: "Not more 20 characters are allowed!" 
                    }
                })}/>}
                <span className="text-red-800 text-xs font-semibold">
                    <ErrorMessage
                        errors={errors}
                        name="password"
                        render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                            <p key={type}>{message}</p>
                        ))}
                    />
                </span>
            </div>

            
            
            {username && <p className="text-black/50">Already have an account?<span className="underline hover:text-black active:text-black ml-1 cursor-pointer" onClick={() => onSendAuthMode("login")}>Login</span></p>}
            {!username && <p className="text-black/50">Don't have an account?<span className="underline hover:text-black active:text-black ml-1 cursor-pointer" onClick={() => onSendAuthMode("createAccount")}>Create</span></p>}
            {!loadingState && <button type="submit" disabled={!isFilled} className={`bg-[#D6336C]/90 shadow-2xl py-2 font-semibold font-sans text-white rounded-xl text-xl transition duration-75 ${!isFilled ? `opacity-75` : `opacity-100 active:scale-97`}`}>{username ? "Create Account" : "Login"}</button>}
            {loadingState && <button type="submit" disabled={!isFilled} className={`bg-[#D6336C]/90 shadow-2xl py-2 font-semibold font-sans text-white rounded-xl text-xl transition duration-75 ${!isFilled ? `opacity-75` : `opacity-100 active:scale-97`}`}><div className="flex justify-center items-center w-full"><img className="w-7 h-auto animate-spin" src="/assets/icons/Rolling@1x-1.0s-200px-200px.svg" /></div></button>}
        </form>
    )
}

export default Form;