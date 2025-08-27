const MAX_OBJECT_COUNT = 1_000_000 as const
const BYTES_I32 = 4 as const
const BYTES_F32 = 4 as const

const HEADER_COUNT = 2 as const
const OBJ_COUNT_ALLOCATED_IDX = 0 as const
const OBJ_COUNT_LIVE_IDX = 1 as const

const OBJ_FIELD_COUNT = 18 as const
const LOCAL_X_IDX = 0 as const
const LOCAL_Y_IDX = 1 as const
const LOCAL_PIVOT_X_IDX = 2 as const
const LOCAL_PIVOT_Y_IDX = 3 as const
const LOCAL_SCALE_X_IDX = 4 as const
const LOCAL_SCALE_Y_IDX = 5 as const
const LOCAL_ROTATION_IDX = 6 as const
const LOCAL_COS_IDX = 7 as const
const LOCAL_SIN_IDX = 8 as const
const LOCAL_ALPHA_IDX = 9 as const
const WORLD_X_IDX = 10 as const
const WORLD_Y_IDX = 11 as const
const WORLD_SCALE_X_IDX = 12 as const
const WORLD_SCALE_Y_IDX = 13 as const
const WORLD_ROTATION_IDX = 14 as const
const WORLD_COS_IDX = 15 as const
const WORLD_SIN_IDX = 16 as const
const WORLD_ALPHA_IDX = 17 as const

export function createInitialObjectStateBuffer(): SharedArrayBuffer {
  return new SharedArrayBuffer(
    HEADER_COUNT * BYTES_I32 +
    MAX_OBJECT_COUNT * OBJ_FIELD_COUNT * BYTES_F32
  )
}

export type ObjectStateManager = {

}

export function createObjectStateManager(sab: SharedArrayBuffer): ObjectStateManager {
  return {

  }
}
