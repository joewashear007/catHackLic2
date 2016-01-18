module catHacklic {
  export module examin {
    export interface basicExam {
      /** any other condition */
      [key: string]: boolean;
      /** Did the user go to mass today */
      mass: boolean;
      /** It is sunday or a holy day*/
      sunday: boolean;
      haveKids: boolean;
      haveParents: boolean;
      haveSpouce: boolean;
      hadSex: boolean;
      hadImmoralThoughs: boolean;
      voted:boolean;
      student: boolean;
      hadArgument: boolean;
    }
    export interface conditions extends basicExam {
    }

    export interface todayItem {
      text: string;
      condition: string;
      selected: boolean;
      show: boolean;
      config: boolean;
    }

    export interface item {
      /** The id of the item */
      id: number;
      /** how common is this item */
      common: number;
      /** whoch commandment does it break */
      commandment?: number;
      /** The parent item to when going in more detail */
      parent?: number;
      /** The text displayed on the main list */
      text: string;
      /** a string condition that will force this to be shown */
      condition?: string;
      /** What vice this item falls under */
      vice?: string;
      /** catechism number for more details */
      catechism?: number;
      /** A detailed description of the particular item */
      details?: string;

      /** Is the item selected on the current exam */
      selected?: boolean;
      /** is the items shown based on the user day */
      shown?: boolean;
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
