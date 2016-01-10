module catHacklic {
  export module examin {
    export interface item {
      id: number;
      text: string;
      selected?: boolean;
      commandment?: number;
      vice?: string;
      virtue?: string;
      category?: string;
      comments?: string;
      seriouness?: number;
      repetition?: number;
      parent?: number;
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
