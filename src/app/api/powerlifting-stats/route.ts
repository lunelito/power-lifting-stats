import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";
import { error } from "console";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const data = body.data;
//     const chunkNumber = body.chunkNumber + 1;

//     if (!Array.isArray(data)) {
//       return NextResponse.json({ error: "Invalid data" }, { status: 400 });
//     }

//     console.log(`Processing chunk ${chunkNumber} with ${data.length} records`);

//     // Format the data
//     const formattedData = data.map((row: any) => ({
//       name: row.Name,
//       sex: row.Sex,
//       event: row.Event,
//       equipment: row.Equipment,
//       age: row.Age,
//       ageclass: row.AgeClass,
//       birthyearclass: row.BirthYearClass,
//       division: row.Division,
//       bodyweightkg: row.BodyweightKg,
//       weightclasskg: row.WeightClassKg,
//       squat1kg: row.Squat1Kg,
//       squat2kg: row.Squat2Kg,
//       squat3kg: row.Squat3Kg,
//       squat4kg: row.Squat4Kg,
//       best3squatkg: row.Best3SquatKg,
//       bench1kg: row.Bench1Kg,
//       bench2kg: row.Bench2Kg,
//       bench3kg: row.Bench3Kg,
//       bench4kg: row.Bench4Kg,
//       best3benchkg: row.Best3BenchKg,
//       deadlift1kg: row.Deadlift1Kg,
//       deadlift2kg: row.Deadlift2Kg,
//       deadlift3kg: row.Deadlift3Kg,
//       deadlift4kg: row.Deadlift4Kg,
//       best3deadliftkg: row.Best3DeadliftKg,
//       totalkg: row.TotalKg,
//       place: row.Place,
//       dots: row.Dots,
//       wilks: row.Wilks,
//       glossbrenner: row.Glossbrenner,
//       goodlift: row.Goodlift,
//       tested: row.Tested,
//       country: row.Country,
//       state: row.State,
//       federation: row.Federation,
//       parentfederation: row.ParentFederation,
//       date: row.Date,
//       meetcountry: row.MeetCountry,
//       meetstate: row.MeetState,
//       meettown: row.MeetTown,
//       meetname: row.MeetName,
//       sanctioned: row.Sanctioned,
//     }));

//     // Filtr to get no sanme records
//     const uniqueFormattedData = formattedData.filter((row, index, array) => {
//       const currentKey = `${row.name}|${row.sex}|${row.event}|${row.date}|${row.federation}|${row.meetname}|${row.division}|${row.best3benchkg}|${row.best3squatkg}|${row.best3deadliftkg}|${row.totalkg}|${row.place}`;

//       const firstIndex = array.findIndex((item) => {
//         const itemKey = `${item.name}|${item.sex}|${item.event}|${item.date}|${item.federation}|${item.meetname}|${item.division}|${item.best3benchkg}|${item.best3squatkg}|${item.best3deadliftkg}|${item.totalkg}|${item.place}`;
//         return itemKey === currentKey;
//       });

//       return firstIndex === index;
//     });

//     // Filtr to get no same records with database
//     const recordIdentifiers = uniqueFormattedData.map((row) => ({
//       name: row.name,
//       sex: row.sex,
//       event: row.event,
//       date: row.date,
//       federation: row.federation,
//       meetname: row.meetname,
//       division: row.division,
//       best3benchkg: row.best3benchkg,
//       best3squatkg: row.best3squatkg,
//       best3deadliftkg: row.best3deadliftkg,
//       totalkg: row.totalkg,
//       place: row.place,
//     }));

//     // check if th record is in database
//     const existingRecordsPromises = recordIdentifiers.map(
//       async (identifier) => {
//         let query = supabase
//           .from("powerlifting_results")
//           .select(
//             "name, sex, event, date, federation, meetname, division, best3benchkg, best3squatkg, best3deadliftkg, totalkg, place"
//           )
//           .eq("name", identifier.name)
//           .eq("sex", identifier.sex)
//           .eq("event", identifier.event)
//           .eq("date", identifier.date)
//           .eq("federation", identifier.federation)
//           .eq("meetname", identifier.meetname)
//           .eq("division", identifier.division);

//         if (identifier.best3benchkg && identifier.best3benchkg !== "") {
//           query = query.eq("best3benchkg", identifier.best3benchkg);
//         }
//         if (identifier.totalkg && identifier.totalkg !== "") {
//           query = query.eq("totalkg", identifier.totalkg);
//         }
//         if (identifier.place && identifier.place !== "") {
//           query = query.eq("place", identifier.place);
//         }

//         const { data: existing, error } = await query.maybeSingle();

//         return { identifier, exists: !!existing && !error };
//       }
//     );

//     const existingRecordsResults = await Promise.all(existingRecordsPromises);

//     // create a map
//     const existingMap = new Map();
//     existingRecordsResults.forEach(({ identifier, exists }) => {
//       const key = `${identifier.name}|${identifier.sex}|${identifier.event}|${identifier.date}|${identifier.federation}|${identifier.meetname}|${identifier.division}|${identifier.best3benchkg}|${identifier.best3squatkg}|${identifier.best3deadliftkg}|${identifier.totalkg}|${identifier.place}`;
//       existingMap.set(key, exists);
//     });

//     // filter only the records that exist on file nto in databse
//     const dataToAdd = uniqueFormattedData.filter((row, index) => {
//       const identifier = recordIdentifiers[index];
//       const key = `${identifier.name}|${identifier.sex}|${identifier.event}|${identifier.date}|${identifier.federation}|${identifier.meetname}|${identifier.division}|${identifier.best3benchkg}|${identifier.best3squatkg}|${identifier.best3deadliftkg}|${identifier.totalkg}|${identifier.place}`;
//       return !existingMap.get(key);
//     });

//     if (dataToAdd.length > 0) {
//       const { error: insertError } = await supabase
//         .from("powerlifting_results")
//         .insert(dataToAdd);

//       if (insertError) {
//         console.error(insertError);
//         return NextResponse.json(
//           { error: "Error while inserting data" },
//           { status: 500 }
//         );
//       }
//       console.log(`aded ${dataToAdd.length} records`);
//     } else {
//       console.log("no new records to add");
//     }

//     return NextResponse.json({
//       message: "OK",
//       totalRecords: formattedData.length,
//       uniqueRecords: uniqueFormattedData.length,
//       addedRecords: dataToAdd.length,
//       existingRecords: uniqueFormattedData.length - dataToAdd.length,
//       duplicatesInChunk: formattedData.length - uniqueFormattedData.length,
//       chunkNumber,
//     });
//   } catch (err) {
//     console.error("server error:", err);
//     return NextResponse.json({ error: "server error" }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body.data;
    const chunkNumber = body.chunkNumber;

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    console.log(`Processing chunk ${chunkNumber} with ${data.length} records`);

    const formattedData = data.map((row: any) => ({
      name: row.Name,
      sex: row.Sex,
      event: row.Event,
      equipment: row.Equipment,
      age: row.Age,
      ageclass: row.AgeClass,
      birthyearclass: row.BirthYearClass,
      division: row.Division,
      bodyweightkg: row.BodyweightKg,
      weightclasskg: row.WeightClassKg,
      squat1kg: row.Squat1Kg,
      squat2kg: row.Squat2Kg,
      squat3kg: row.Squat3Kg,
      squat4kg: row.Squat4Kg,
      best3squatkg: row.Best3SquatKg,
      bench1kg: row.Bench1Kg,
      bench2kg: row.Bench2Kg,
      bench3kg: row.Bench3Kg,
      bench4kg: row.Bench4Kg,
      best3benchkg: row.Best3BenchKg,
      deadlift1kg: row.Deadlift1Kg,
      deadlift2kg: row.Deadlift2Kg,
      deadlift3kg: row.Deadlift3Kg,
      deadlift4kg: row.Deadlift4Kg,
      best3deadliftkg: row.Best3DeadliftKg,
      totalkg: row.TotalKg,
      place: row.Place,
      dots: row.Dots,
      wilks: row.Wilks,
      glossbrenner: row.Glossbrenner,
      goodlift: row.Goodlift,
      tested: row.Tested,
      country: row.Country,
      state: row.State,
      federation: row.Federation,
      parentfederation: row.ParentFederation,
      date: row.Date,
      meetcountry: row.MeetCountry,
      meetstate: row.MeetState,
      meettown: row.MeetTown,
      meetname: row.MeetName,
      sanctioned: row.Sanctioned,
    }));

    const { error: insertError } = await supabase
      .from("powerlifting_results")
      .insert(formattedData);

    if (insertError) {
      console.error("Error while inserting data:", insertError);
      return NextResponse.json(
        { error: "Error while inserting data" },
        { status: 500 }
      );
    }

    console.log(`Added ${formattedData.length} records`);

    return NextResponse.json({
      message: "OK",
      totalRecords: formattedData.length,
      addedRecords: formattedData.length,
      chunkNumber,
    });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page"));

    if (page < 1) {
      NextResponse.json({ error: "Invalid Page" }, { status: 400 });
    }

    const start = (page - 1) * 100 + 1;
    const end = page * 100;

    const { error: errorChunk, data } = await supabase
      .from("powerlifting_results")
      .select("*")
      .gte("id", start)
      .lte("id", end);
    const { error: errorTotal, count } = await supabase
      .from("powerlifting_results")
      .select("*", { count: "exact" });

    if (data) {
      return NextResponse.json({
        data: data,
        count: count,
      });
    }

    if (errorChunk || errorTotal) {
      console.log(error);
      return NextResponse.json({ error: error }, { status: 404 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "server errror" }, { status: 500 });
  }
}
