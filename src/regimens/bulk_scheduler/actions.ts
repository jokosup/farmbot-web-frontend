import { warning, error } from "../../logger";
import {
    BulkSchedulerOutput,
    BulkSchedulerState
} from "./interfaces";
import { RegimenItem } from "../interfaces";
import { ReduxAction, Everything, Thunk } from "../../interfaces";
import { Sequence } from "../../sequences/interfaces";
import { groupRegimenItemsByWeek } from "./group_regimen_items_by_week";
import { t } from "i18next";

export function pushWeek() {
    return {
        type: "PUSH_WEEK"
    };
}

export function popWeek() {
    return {
        type: "POP_WEEK"
    };
}

interface SetTimeOffsetProps {
    hours: number;
    minutes: number;
}

const MINUTES_MS = 1000 * 60;
const HOURS_MS = MINUTES_MS * 60;

/** Sets daily offset of a regimen */
export function setTimeOffset({hours, minutes}: SetTimeOffsetProps) {
    let milliseconds = [hours * HOURS_MS, minutes * MINUTES_MS]
        .reduce((num, acc) => num + acc);

    if (_.isNaN(milliseconds) || !_.isNumber(milliseconds)) {
        let m = "Time is not properly formatted.";
        warning(m, "Bad Input");
        return {
            type: "TIME_OFFSET_ERROR",
            payload: 0
        };

    } else {
        return {
            type: "SET_TIME_OFFSET",
            payload: milliseconds
        };
    };
}

export interface ToggleDayParams {
    week: number;
    day: number;
}

export function toggleDay({week, day}: ToggleDayParams) {
    return {
        type: "TOGGLE_DAY",
        payload: {
            week,
            day
        }
    };
}

export function setSequence(sequence: Sequence): ReduxAction<Sequence> {
    return {
        type: "SET_SEQUENCE",
        payload: sequence
    };
};

export function commitBulkEditor(): Thunk {

    return function (dispatch, getState) {
        const state: Everything = getState();
        let index = state.regimens.current;

        const regimenDoesExist = state.regimens.all[state.regimens.current];

        if (state.bulkScheduler.sequence && regimenDoesExist) {
            const regimenItems = groupRegimenItemsByWeek(
                state.bulkScheduler.form.weeks,
                state.bulkScheduler.form.dailyOffsetMs,
                state.bulkScheduler.sequence);
            dispatch({
                type: "COMMIT_BULK_EDITOR",
                payload: { regimenItems, index }
            });
        } else {
            error(t("Select a sequence from the dropdown first."));
            (!regimenDoesExist && warning(t("Select a regimen or create one first.")));
        }
    };
}
