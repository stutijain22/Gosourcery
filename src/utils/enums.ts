/**
 * @enumeration for some predefined types and mode.
 * */

export enum resizeMode {
    cover = "cover", contain = "contain", stretch = "stretch", repeat = "repeat", center = "center"
}

export enum overFlow {
    visible = "visible", hidden = "hidden"
}

export enum inputTypes {
    'text', 'phone' , 'date', 'radio', 'checkbox', 'toggle', 'starRating', 'number', 'select', 'email'
}

export enum imageTypes {
    'local', 'uri'
}

export enum dateFormat {
    DDMMYYYY_WITH_FORESLASH = "DD/MM/YYYY",
    MMDDYYYY_WITH_FORESLASH = "MM/DD/YYYY",
    YYYYMMDD_WITH_FORESLASH = "YYYY/MM/DD",
    DDMMYYYY_WITH_HYPHEN = "DD-MM-YYYY",
    MMDDYYYY_WITH_HYPHEN = "MM-DD-YYYY",
    YYYYMMDD_WITH_HYPHEN = "YYYY-MM-DD", // default compatible to database
    DDMMMYYYY_WITH_STYLE = "DD MMM, YYYY" // default compatible to database
}