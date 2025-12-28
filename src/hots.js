const hotStates = ["WA", "OR", "CA", "ID"];

export function randPick(arr) {
    if (!arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

export function isHot(zip) {
    if (zip.length !== 8) return false;
    const state = zip.slice(0, 2);

    if (!hotStates.includes(state)) {
        return true;
    }
    
    switch (state) {
        case "WA":
            return zip === "WA 98666";
        case "OR":
            return zip === "OR 97405";
        case "CA":
            return zip === "CA 95501";
        case "ID":
            return zip === "ID 83539";
    }
}

export function randHot() {
    const state = randPick(hotStates);

    if (state === "WA") {
        return "WA 98666";
    } else if (state === "OR") {
        return "OR 97405";
    } else if (state === "CA") {
        return "CA 95501";
    } else if (state === "ID") {
        return "ID 83539";
    }
}
