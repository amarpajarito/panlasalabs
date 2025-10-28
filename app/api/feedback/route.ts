import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any = null;
let serviceReady = true;
let serviceErrorMsg = "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  serviceReady = false;
  serviceErrorMsg =
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment";
  console.error("[api/feedback]", serviceErrorMsg);
} else {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  } catch (e: any) {
    serviceReady = false;
    serviceErrorMsg = String(e?.message ?? e);
    console.error("[api/feedback] failed to create supabase client:", e);
  }
}

// Probe for column existence using lightweight selects and cache results
const columnsCache: Record<string, boolean> = {};
async function columnExists(col: string) {
  if (col in columnsCache) return columnsCache[col];
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select(col)
      .limit(1);
    if (error) {
      // column likely doesn't exist
      columnsCache[col] = false;
      return false;
    }
    columnsCache[col] = true;
    return true;
  } catch (e) {
    columnsCache[col] = false;
    return false;
  }
}

async function pickColumn(candidates: string[]) {
  for (const c of candidates) {
    const ok = await columnExists(c);
    if (ok) return c;
  }
  return null;
}

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  try {
    if (!serviceReady) {
      return NextResponse.json({ error: serviceErrorMsg }, { status: 500 });
    }
    const body = await req.json();
    const { rating, message, user } = body;
    // Basic validation
    if (!rating) {
      return NextResponse.json({ error: "Missing rating" }, { status: 400 });
    }
    if (!message || String(message).trim() === "") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    // Heuristics for common column names (probe existence)
    const messageCol = await pickColumn([
      "message",
      "review",
      "comment",
      "content",
      "body",
      "text",
    ]);
    const nameCol = await pickColumn(["name", "full_name", "username"]);
    const avatarCol = await pickColumn([
      "avatar_url",
      "avatar",
      "image",
      "profile_image",
    ]);
    const createdAtCol = await pickColumn([
      "created_at",
      "inserted_at",
      "created",
    ]);
    const userIdColPost = await pickColumn([
      "user_id",
      "user",
      "author_id",
      "userId",
    ]);
    const userIdColGet = await pickColumn([
      "user_id",
      "user",
      "author_id",
      "userId",
    ]);

    const insertPayload: any = {};
    insertPayload.rating = Number(rating);
    if (messageCol) insertPayload[messageCol] = message ?? null;
    if (createdAtCol) insertPayload[createdAtCol] = new Date().toISOString();
    if (user) {
      // Only write to a UUID-typed user id column if the provided id is a UUID.
      if (userIdColPost && user.id) {
        if (typeof user.id === "string" && uuidRegex.test(user.id)) {
          insertPayload[userIdColPost] = user.id;
        } else {
          // find a text-friendly fallback column to store external id
          const fallback = await pickColumn([
            "user_text_id",
            "external_id",
            "user_external_id",
            "uid",
            "author",
          ]);
          if (fallback) insertPayload[fallback] = String(user.id);
          else {
            // don't write the id into a uuid column to avoid 22P02
            console.warn(
              "[api/feedback] skipping write of non-UUID user.id into uuid column"
            );
          }
        }
      }
      if (nameCol) insertPayload[nameCol] = user.name ?? null;
      // sometimes avatar column name varies
      if (avatarCol) insertPayload[avatarCol] = user.image ?? null;
      // probe for email column
      if ((await columnExists("email")) && user.email)
        insertPayload.email = user.email;
    }

    // Remove keys with undefined to avoid insert errors
    Object.keys(insertPayload).forEach(
      (k) => insertPayload[k] === undefined && delete insertPayload[k]
    );

    const { data, error } = await supabase
      .from("feedback")
      .insert(insertPayload)
      .select();

    if (error) {
      console.error("[api/feedback] insert error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    // Normalize returned row to a standard shape for clients
    const row = (data && data[0]) ?? null;
    const normalized = row
      ? {
          id: row.id,
          rating: row.rating,
          message: messageCol ? row[messageCol] ?? null : row.message ?? null,
          name: nameCol ? row[nameCol] ?? null : row.name ?? null,
          avatar_url: avatarCol
            ? row[avatarCol] ?? null
            : row.avatar_url ?? null,
          created_at:
            row[(createdAtCol ?? "created_at") as string] ??
            row.created_at ??
            null,
          // include user id if present so GET can later resolve user info
          user_id: userIdColPost
            ? row[userIdColPost] ?? null
            : row.user_id ?? null,
        }
      : null;
    // Also include the user info provided in the POST so the client can show it immediately
    const provided = user
      ? {
          provided_name: user.name ?? null,
          provided_avatar: user.image ?? null,
        }
      : undefined;

    return NextResponse.json({ ok: true, feedback: normalized, provided });
  } catch (err: any) {
    console.error("[api/feedback] POST error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!serviceReady) {
      return NextResponse.json({ error: serviceErrorMsg }, { status: 500 });
    }
    // choose useful columns by probing existence
    const messageCol = await pickColumn([
      "message",
      "review",
      "comment",
      "content",
      "body",
      "text",
    ]);
    const nameCol = await pickColumn(["name", "full_name", "username"]);
    const avatarCol = await pickColumn([
      "avatar_url",
      "avatar",
      "image",
      "profile_image",
    ]);
    const createdAtCol = await pickColumn([
      "created_at",
      "inserted_at",
      "created",
    ]);

    // build select list based on available columns
    const selectCols = ["id", "rating"];
    if (messageCol) selectCols.push(messageCol);
    if (nameCol) selectCols.push(nameCol);
    if (avatarCol) selectCols.push(avatarCol);
    if (createdAtCol) selectCols.push(createdAtCol);
    // always try to include common columns even if not found (Supabase will ignore missing ones only if schema allows - we guard earlier)
    const selectStr = selectCols.join(",");

    const { data, error } = await supabase
      .from("feedback")
      .select(selectStr)
      .order(createdAtCol ?? "created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("[api/feedback] select error:", error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    // helper to find a user id in the returned row regardless of column name
    const findUserId = (row: any) => {
      const candidates = ["user_id", "user", "author_id", "userId", "userid"];
      for (const c of candidates) {
        if (Object.prototype.hasOwnProperty.call(row, c)) return row[c];
      }
      return null;
    };

    const normalized = (data ?? []).map((row: any) => ({
      id: row.id,
      rating: row.rating,
      message: messageCol ? row[messageCol] ?? null : row.message ?? null,
      name: nameCol ? row[nameCol] ?? null : row.name ?? null,
      avatar_url: avatarCol ? row[avatarCol] ?? null : row.avatar_url ?? null,
      created_at: row[createdAtCol ?? "created_at"] ?? row.created_at ?? null,
      user_id: findUserId(row) ?? null,
    }));

    // If some rows are missing name/avatar but have a user_id, try to enrich by querying users table
    const missingUserIds = Array.from(
      new Set(
        normalized
          .filter((r: any) => (!r.name || !r.avatar_url) && r.user_id)
          .map((r: any) => r.user_id)
      )
    ).filter(Boolean);

    if (missingUserIds.length > 0) {
      try {
        // Try selecting multiple possible name/avatar fields from users table
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select(
            "id, name, first_name, last_name, full_name, avatar_url, image, avatar"
          )
          .in("id", missingUserIds as any[]);

        if (usersError) {
          console.warn("[api/feedback] users lookup error:", usersError);
        } else if (usersData) {
          // Build map that resolves preferred name and avatar_url from available fields
          const usersMap = new Map(
            (usersData as any[]).map((u) => {
              // determine name: prefer full_name, then name, then first_name + last_name
              let resolvedName = u.full_name ?? u.name ?? null;
              if (!resolvedName && u.first_name)
                resolvedName =
                  u.first_name + (u.last_name ? ` ${u.last_name}` : "");
              // determine avatar: prefer avatar_url, then image, then avatar
              const resolvedAvatar =
                u.avatar_url ?? u.image ?? u.avatar ?? null;
              return [
                u.id,
                { id: u.id, name: resolvedName, avatar_url: resolvedAvatar },
              ];
            })
          );

          for (const r of normalized) {
            if ((!r.name || !r.avatar_url) && r.user_id) {
              const u = usersMap.get(r.user_id);
              if (u) {
                r.name = r.name ?? u.name ?? r.name;
                r.avatar_url = r.avatar_url ?? u.avatar_url ?? r.avatar_url;
              }
            }
          }
        }
      } catch (e) {
        console.warn("[api/feedback] failed to enrich users:", e);
      }
    }

    return NextResponse.json({ ok: true, feedback: normalized });
  } catch (err: any) {
    console.error("[api/feedback] GET error:", err);
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
