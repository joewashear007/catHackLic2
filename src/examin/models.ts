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

    export interface Iitem {
      /** The text displayed on the main list */
      text: string;
      /** Is the item selected on the current exam */
      selected: boolean;

    }

    export interface todayItem extends Iitem{
      condition: string;
      show: boolean;
      config: boolean;
    }

    export interface item extends Iitem{
      /** The id of the item */
      id: number;
      /** how common is this item */
      common: number;
      /** whoch commandment does it break */
      commandment?: number;
      /** The parent item to when going in more detail */
      parent?: number;
      /** a string condition that will force this to be shown */
      condition?: string;
      /** What vice this item falls under */
      vice?: string;
      /** catechism number for more details */
      catechism?: number;
      /** A detailed description of the particular item */
      details?: string;

      /** is the items shown based on the user day */
      shown?: boolean;
    }

    export type summary = { note: string, items: { text: string }[] }[]
    export interface examHistoryItem {
      summary: summary;
      date: Date;
      submissionDate: Date;      
    }
  }
}
