module catHacklic {
  export module v1 {

    /** Save which item are most common for the user */
    export interface commonItem {
      id: number;
      common: number;
    }

    export interface userInfo {
      /** any other properties */
      [key: string]: boolean;
      haveParents: boolean;
      haveKids: boolean;
      haveSpouce: boolean;
      /** Is the user a student or have teachers */
      student: boolean;
      employed: boolean;
      /** is the user a practising catholic */
      practising: boolean;
    }
  }
}
