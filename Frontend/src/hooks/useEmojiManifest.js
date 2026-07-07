import { useEffect, useState } from "react";

const useEmojiManifest = () => {
    const [emojis, setEmojis] = useState([]);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        fetch("/public/emojis library/manifest.json")
        .then(
            r => 
                r.json()
                .then(setEmojis)
                .catch(e => setErrors(e))
        )
        .catch(e => setErrors(e));
    }, [])

    return { emojis, errors };
}

export default useEmojiManifest;