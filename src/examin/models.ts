module catHacklic {
  export module examin {
    export interface item {
      text: string;
      selected?: boolean;
      commandment?: number;
      vice?: string;
      virtue?: string;
      category?: string;
      comments?: string;
      seriouness?: number;
      repetition?: number;
    }

    export interface result {
      summary: summary;
      date: Date;
      submissionDate: Date;

    }
    export interface summary {
      [index: string]: item[]
    }
  }
}
