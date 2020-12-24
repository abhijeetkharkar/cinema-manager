export interface InitialConfig {
    status: boolean,
    lookupPaths: string[]
}

export interface Rating {
    Source: string,
    Value: string
}

export interface Cinema {
    Id: number,
    ImdbId: string,
    Title: string,
    Year: number,
    Rated: string,
    Runtime: string,
    Genre: string,
    Director: string,
    Actors: string,
    Plot: string,
    Language: string,
    Country: string,
    Awards: string,
    Poster: string,
    Ratings: Rating[],
    Metascore: string,
    ImdbRating: string,
    ImdbVotes: string
}