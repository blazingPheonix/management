const {useState} = require('react')
const {toast} = require('sonner');

export const useFetch = ( cb ) => {
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const fn = async(...args)=>{
        setLoading(true);
        setError(null);
        console.log('inside fn function ',args,cb);
        try{
            const response = await cb(...args);
            console.log('response received',response);
            setData(response);
            setError(null);
            return response;
        }catch(error)
        {
            setError(error);
            toast.error(error.message);

        }finally{
            setLoading(false);
        };
    }
    return {data,loading,error,fn,setData};
}