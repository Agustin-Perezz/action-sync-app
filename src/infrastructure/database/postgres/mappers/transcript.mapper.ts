import { Transcript } from "@/domain/entities/transcript.entity";
import type {
  TranscriptInsert,
  TranscriptRow,
} from "../entities/transcript.entity";

export const transcriptMapper = {
  toDomain(row: TranscriptRow): Transcript {
    return Transcript.create({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      rawText: row.raw_text,
      status: row.status,
      createdAt: row.created_at,
    });
  },

  toPersistence(transcript: Transcript): TranscriptInsert {
    const props = transcript.toObject();
    return {
      id: props.id,
      user_id: props.userId,
      title: props.title,
      raw_text: props.rawText,
      status: props.status,
      created_at: props.createdAt,
    };
  },
};
