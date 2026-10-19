import { Request, Response } from "express";

let mentorshipStore: any[] = [
  {
    id: "mentor-sess-01",
    artisanId: "creator-sunita",
    artisanName: "Sunita Devi",
    sessionTitle: "Khurja Terracotta Glazing & Kiln Setup",
    format: "45 Mins 1-on-1 Video Call",
    fee: 999,
    availableDays: "Saturdays & Sundays, 4 PM – 7 PM IST",
    topics: ["Kiln temperature curves", "Natural lead-free glazes", "Wholesale raw clay sourcing"],
    active: true
  }
];

export class MentorshipController {
  public static async getOfferings(req: Request, res: Response) {
    res.json({ success: true, count: mentorshipStore.length, offerings: mentorshipStore });
  }

  public static async updateOffering(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;
    let offering = mentorshipStore.find((m) => m.id === id);
    if (!offering) {
      offering = { id, ...updates };
      mentorshipStore.push(offering);
    } else {
      Object.assign(offering, updates);
    }
    res.json({ success: true, offering });
  }
}
