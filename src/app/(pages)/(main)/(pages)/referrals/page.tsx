"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, UserPlus, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for referral statistics
const stats = [
  {
    title: "Your Earnings",
    value: "$127,589",
    icon: "$",
  },
  {
    title: "Your Profit",
    value: "$67,325",
    icon: "📈",
  },
  {
    title: "Customers",
    value: "1,849",
    icon: "👥",
  },
  {
    title: "Average Value",
    value: "$69.00",
    icon: "💳",
  },
  {
    title: "Refund Rate",
    value: "5.70%",
    icon: "↩️",
  },
];

// Mock data for referred users
const referredUsers = [
  {
    id: 1,
    name: "Vlad Mihalache",
    avatar: "/avatars/vlad.jpg",
    value: "$189,044",
    profit: "$90,732",
    orders: "18,203",
  },
  {
    id: 2,
    name: "Fredy Andrei",
    avatar: "/avatars/fredy.jpg",
    value: "$143,885",
    profit: "$79,943",
    orders: "12,942",
  },
  {
    id: 3,
    name: "Anonymous User",
    avatar: null,
    value: "$127,331",
    profit: "$72,365",
    orders: "10,430",
  },
];

export default function ReferralsPage() {
  const [email, setEmail] = useState("");
  const referralLink = "horizon-ui.com/ref=947385";

  const steps = [
    {
      icon: <MessageSquare className="w-8 h-8 text-primary" />,
      title: "Send Invitation",
      description: "Send your referral link to friends and tell them how useful Horizon is!",
    },
    {
      icon: <UserPlus className="w-8 h-8 text-primary" />,
      title: "Registration",
      description: "Let your friends register to our services using your personal referral code!",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Use Horizon for Free!",
      description: "You and your friends get 2 premium Horizon features for free!",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Referrals</h1>
        <p className="text-sm text-muted-foreground">Main Pages / Ecommerce / Referrals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Earn with Horizon UI</h2>
          <p className="text-sm text-muted-foreground mb-8">
            Invite your friends to Horizon, if they sign up, you and your friend will get 2 premium features for free!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-primary/10 p-4 rounded-full mb-4">{step.icon}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
            {/* Dotted lines connecting steps */}
            <div className="hidden md:block absolute top-12 left-1/3 w-1/3 border-t-2 border-dashed border-primary/30" />
            <div className="hidden md:block absolute top-12 right-1/3 w-1/3 border-t-2 border-dashed border-primary/30" />
          </div>
        </Card>

        {/* Right Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Invite your friends!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Add your friends email addresses and send them invitations to join!
          </p>

          <div className="space-y-6">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email addresses..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Share the referral link</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You can also share your referral link by copying and sending it to your friends or sharing it on social
                media.
              </p>
              <div className="flex gap-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline">Copy link</Button>
                <Button variant="outline">
                  <i className="fab fa-facebook text-blue-600" />
                </Button>
                <Button variant="outline">
                  <i className="fab fa-twitter text-blue-400" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>USER NAME</TableHead>
              <TableHead>VALUE</TableHead>
              <TableHead>PROFIT</TableHead>
              <TableHead>ORDERS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {user.avatar ? (
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.value}</TableCell>
                <TableCell>{user.profit}</TableCell>
                <TableCell>{user.orders}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
