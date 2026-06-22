const greetUser = () => {
    const currTime = new Date();
    const hours = currTime.getHours();

    let greetings = [];

    if (hours >= 5 && hours < 12) {
        greetings = [
            "Good Morning!",
            "Bright day,",
            "Rise up,",
            "Fresh start,",
            "Hello sun,",
            "New dawn"
        ];
    }

    else if (hours >= 12 && hours < 17) {
        greetings = [
            "Good Afternoon!",
            "Midday vibes,",
            "Sunny noon,",
            "Day glow,",
            "Keep going,",
            "Warm light,"
        ];
    }

    else if (hours >= 17 && hours < 21) {
        greetings = [
            "Good Evening!",
            "Calm eve,",
            "Soft dusk,",
            "Chill time,",
            "Evening glow,",
            "Night fall,"
        ];
    }

    else {
        greetings = [
            "Good Night!",
            "Sweet rest,",
            "Sleep well,",
            "Night peace,",
            "Rest easy,",
            "Dream on,"
        ];
    }

    return greetings[
        Math.floor(
            Math.random() * greetings.length
        )
    ];
};

export default greetUser;