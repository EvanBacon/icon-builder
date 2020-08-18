/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Dimensions, ScaledSize } from "react-native";
import { useEffect, useState } from "react";

export default function useWindowDimensions(): ScaledSize {
  const [dims, setDims] = useState<ScaledSize>(() => Dimensions.get("window"));
  useEffect(() => {
    function handleChange({ window }: { window: ScaledSize }) {
      setDims(window);
    }
    Dimensions.addEventListener("change", handleChange);
    // We might have missed an update between calling `get` in render and
    // `addEventListener` in this handler, so we set it here. If there was
    // no change, React will filter out this update as a no-op.
    setDims(Dimensions.get("window"));
    return () => {
      Dimensions.removeEventListener("change", handleChange);
    };
  }, []);
  return dims;
}
