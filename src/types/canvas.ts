export type DrawOptions = Partial<{ color: string }>;
export type LineOptions = DrawOptions &
	Partial<{ dashed: boolean; thickness: number }>;
export type PathOptions = DrawOptions &
	LineOptions &
	Partial<{ action: "stroke" | "fill" }>;
export type PointOptions = DrawOptions & Partial<{ radius: number }>;
